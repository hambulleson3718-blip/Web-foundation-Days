# Day 6 Assignment: School Database Design

## 1. Description of the Tables

### Students Table
The students table stores information about students. It contains student_id as the primary key, student_name to store the student's name, and email to store the student's email address. The email field is UNIQUE and NOT NULL to prevent duplicate or missing email addresses.

### Courses Table
The courses table stores information about courses offered by the school. It contains course_id as the primary key and course_name to identify each course. Both fields are required, and course_name is UNIQUE to prevent duplicate course names.

### Enrolments Table
The enrolments table records which students are enrolled in which courses. It contains enrolment_id as the primary key, student_id and course_id as foreign keys, and grade to store the student's grade in a course. The combination of student_id and course_id is UNIQUE to prevent a student from enrolling in the same course more than once.

## 2. Relationships Between the Tables

There is a one-to-many relationship between students and enrolments because one student can have several enrolment records, but each enrolment belongs to one student.

There is also a one-to-many relationship between courses and enrolments because one course can have several enrolment records, but each enrolment belongs to one course.

Students and courses have a many-to-many relationship because one student can take several courses, and one course can have several students. The enrolments table acts as a join table that resolves this many-to-many relationship. It also stores information specific to each enrolment, such as the student's grade.

## 3. Index Recommendation

I would add an index on the course_id column in the enrolments table to improve the performance of queries that retrieve students taking a particular course and queries that group enrolments by course. This index can help SQLite locate matching enrolment records more efficiently as the database grows.

Example SQL:

CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);

## 4. SQL or NoSQL?

I would choose SQL for this school database because students, courses, and enrolments have clearly defined relationships. A relational database such as SQLite supports primary keys, foreign keys, unique constraints, and joins, which help maintain data accuracy and prevent invalid or duplicate enrolments. SQL also makes it straightforward to calculate student numbers per course and retrieve grades. A NoSQL database could be useful for flexible or unstructured data, but a relational SQL database is a better fit for this system.

