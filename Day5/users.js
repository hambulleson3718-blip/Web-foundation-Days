const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const status = document.getElementById("status");
const usersList = document.getElementById("users-list");

let users = [];

function renderUsers(list) {
  usersList.textContent = "";

  if (list.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No users match your filter.";
    usersList.appendChild(message);
    return;
  }

  list.forEach(function(user) {
    const li = document.createElement("li");

    const name = document.createElement("h3");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(city);
    li.appendChild(company);

    usersList.appendChild(li);
  });
}

async function loadUsers() {
  loadButton.disabled = true;
  status.textContent = "Loading users...";

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
      throw new Error("Failed to load users.");
    }

    users = await response.json();

    renderUsers(users);

    status.textContent =
      `Successfully loaded ${users.length} users.`;
  } catch (error) {
    status.textContent =
      "Error loading users. Please try again.";

    usersList.textContent = "";
    console.error("Error loading users:", error);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", function() {
  const searchText = filterInput.value.toLowerCase();

  const filteredUsers = users.filter(function(user) {
    return user.name.toLowerCase().includes(searchText);
  });

  renderUsers(filteredUsers);
});
