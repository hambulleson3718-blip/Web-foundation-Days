SnapShare Photo App Scaling Plan
1. Assumptions
SnapShare has 10 million registered users.
Ten percent of registered users are active each day.
Each daily active user uploads one photo per day.
Each daily active user views 50 feed pages per day.
Each original photo is 2 MB.
Each photo has one thumbnail of 50 KB.
One day has 86,400 seconds, and one year has 365 days.
Uploads and feed views are distributed across 24 hours for average-rate calculations.
Peak feed traffic is five times the average rate.
Storage estimates use decimal units: 1 MB = 1,000 KB and 1 TB = 1,000 GB. Replication, backups, and additional overhead are excluded.
2. Traffic and Storage Calculations
Daily Active Users
Daily active users = Registered users × Daily active percentage

= 10,000,000 × 10%

= 1,000,000 daily active users

Uploads per Second
Daily uploads = 1,000,000 × 1 photo

= 1,000,000 photos per day

Average uploads per second = 1,000,000 ÷ 86,400

= 11.57 uploads per second

Feed Views per Second
Daily feed views = 1,000,000 × 50

= 50,000,000 feed views per day

Average feed views per second = 50,000,000 ÷ 86,400

= 578.70 feed views per second

Peak feed views per second = 578.70 × 5

= 2,893.52 feed views per second

Photo Storage Per Year
Original photo storage per day:

1,000,000 × 2 MB = 2,000,000 MB = 2,000 GB

Thumbnail storage per day:

1,000,000 × 50 KB = 50,000,000 KB = 50 GB

Total storage per day:

2,000 GB + 50 GB = 2,050 GB

Total storage per year:

2,050 GB × 365 = 748,250 GB

Therefore, annual photo storage is approximately 748.25 TB, including thumbnails, before replication, backups, and other overhead.

3. Read-Heavy or Write-Heavy?
SnapShare is a read-heavy system because users generate 50 million feed views per day compared with 1 million photo uploads per day. This represents approximately 50 feed views for every upload.

The design should prioritize fast reads by caching frequently requested feed data, delivering photos through a Content Delivery Network (CDN), and using a database read replica to distribute database read traffic. Uploads should use object storage and asynchronous thumbnail processing to keep the upload path responsive.

. System Architecture

                      SNAPSHARE USERS
                             |
                             v
                    +----------------+
                    | CDN |
                    | Cached Photos |
                    +----------------+
                             |
                             v
                    +----------------+
                    | Load Balancer |
                    +----------------+
                             |
                 +-----------+-----------+
                 | | |
                 v v v
             +--------+ +--------+ +--------+
             | App | | App | | App |
             | Server | | Server | | Server |
             +--------+ +--------+ +--------+
                 | |
                 +-----+-----+
                       |
          +------------+-------------+
          | | |
          v v v
     +----------+ +----------+ +----------------+
     | Cache | | Database | | Object Storage |
     | | | Primary | | Original Photos|
     +----------+ +----+-----+ +----------------+
                         |
                         v
                   +-----------+
                   | Read |
                   | Replica |
                   +-----------+

Photo Upload Processing:
     App Server
          |
          v
     +-----------+
     | Queue |
     +-----------+
          |
          v
     +-----------+
     | Worker |
     | Thumbnail |
     | Generator |
     +-----------+
          |
          v
     +----------------+
     | Object Storage |
     | Thumbnails |
     +----------------+

Component Responsibilities

1. CDN: Delivers frequently requested photos and thumbnails from nearby edge locations, reducing latency and load on the application servers.
2. Load balancer: Distributes incoming application requests across multiple app servers to prevent one server from becoming overloaded.
3. App servers: Handle authentication, photo upload requests, feed generation, and communication with the cache, database, and object storage.
4. Cache: Stores frequently accessed feed data and other reusable results in fast memory, reducing repeated database queries.
5. Primary database: Stores structured information such as users, photo metadata, captions, follow relationships, and feed-related records.
6. Database read replica: Copies data from the primary database and serves eligible read queries, reducing read pressure on the primary.
7. Object storage: Stores original photos and generated thumbnails as files, allowing photo storage to scale independently of the relational database.
8. Queue: Holds thumbnail-generation jobs so that photo uploads do not need to wait for image processing to finish.
9. Thumbnail worker: Takes jobs from the queue, generates smaller image versions, and saves them to object storage.

Why Photos Should Not Be Stored Inside the Database

Original photos and thumbnails are large binary files. Storing them directly in the database can increase database size, backup times, and storage costs while competing with structured-data queries. Instead, SnapShare should store photo files in scalable object storage and keep their URLs or object keys, captions, owners, timestamps, and other metadata in the database.

5. Step-by-Step Photo Upload Flow

1. User uploads a photo: The user selects a photo, adds a caption, and submits it through the SnapShare application.
2. Request reaches the load balancer: The load balancer directs the request to an available application server.
3. Application validates the request: The app server checks the user's authentication, file type, file size, and upload permissions.
4. Original photo is stored: The application uploads the original photo to object storage and obtains its object key or URL.
5. Metadata is saved: The application records the photo owner, caption, object key, upload time, and processing status in the primary database.
6. Thumbnail job is queued: The application places a thumbnail-generation job on the queue containing the photo's object key and the necessary processing details.
7. Worker processes the job: A background worker retrieves the original photo from object storage, generates a 50 KB thumbnail, and stores it in object storage.
8. Metadata is updated: The worker or application updates the photo's processing status and records the thumbnail object key in the database.
9. Photo becomes available: Once processing is complete, the feed can display the photo using its thumbnail, while the original can be served when required.
10. CDN delivers the image: When users request the photo or thumbnail, the CDN serves a cached copy when available or retrieves it from the origin storage when necessary.

The thumbnail job is processed asynchronously, allowing the application to acknowledge a successful upload before thumbnail generation finishes, provided the original photo and its metadata have been safely saved. The system should retry failed jobs and track processing status so that thumbnails are not permanently lost when a worker fails.

6. Architecture Trade-offs

Trade-off 1: Caching vs. Data Freshness

Caching feed data reduces database load and improves response times. However, cached feeds may temporarily show outdated information after a user uploads a photo or follows someone new. SnapShare must choose appropriate cache expiration times and invalidate or refresh affected cache entries when necessary.

Trade-off 2: Asynchronous Thumbnail Processing vs. Immediate Availability

Using a queue and background worker makes uploads faster because users do not have to wait for thumbnail generation. However, the thumbnail may not be available immediately, and worker failures can delay processing. The system should track job status, retry failures, and provide a fallback until the thumbnail is ready.

Trade-off 3: Database Read Replica vs. Consistency

A read replica distributes read traffic and improves database scalability. However, replication can lag behind the primary database, meaning a newly uploaded photo may not appear immediately in some queries. The application can direct critical reads to the primary database when immediate consistency is required.

Trade-off 4: Object Storage vs. Direct Database Storage

Object storage scales efficiently for large photo files and separates media storage from structured database operations. However, it requires additional management of object keys, access permissions, lifecycle policies, and CDN integration. This added complexity is worthwhile for a photo-sharing application with substantial media storage requirements.

7. Conclusion

SnapShare should use a read-optimized architecture built around a CDN, load balancer, multiple application servers, caching, a primary database with a read replica, and scalable object storage. A queue and background worker should generate thumbnails asynchronously. This architecture supports an estimated 1 million daily active users, approximately 579 average feed views per second, approximately 2,894 peak feed views per second, and approximately 748.25 TB of new photo and thumbnail storage per year.