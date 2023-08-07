const axios = require("axios");

const url = "https://reqres.in/api";

// first test - check for GET request of users
it("make a GET request to - https://reqres.in/api/users and verify get users", async () => {
  console.log("get the users");
  const response = await axios.get(`${url}/users`);
  expect(response.status).toBe(200);
  response.data.data.forEach((user) => {
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("first_name");
    expect(user).toHaveProperty("last_name");
    expect(user).toHaveProperty("avatar");
  });
});

// check for GET request of users - validation of “total”, “page”, “total_pages”, “per_page”
it("make a GET request to - https://reqres.in/api/users and verify the page and total info", async () => {
  console.log("get the users");
  const response = await axios.get(`${url}/users`);
  console.log("validation of the page, per_page, total_pages, total");
  expect(response.status).toEqual(200);
  expect(response.data.total).toBeGreaterThan(0);
  expect(response.data.page).toBeGreaterThanOrEqual(1);
  expect(response.data.per_page).toBeGreaterThan(0);
  expect(response.data.total_pages).toBeGreaterThanOrEqual(1);
  expect(response.data.total_pages * response.data.per_page).toEqual(
    response.data.total
  );
});

// make a GET request to this URL but with different Endpoint
it("there is no returned data - the response should be with error (404)", async () => {
  try {
    await axios.get(`${url}/userss`);
  } catch (err) {
    expect(err.response.message).toEqual("path not found"); // this is by the error that written in the api
    expect(err.response.status).toEqual(404);
    console.log("the path that you trying to reach is invalid"); // this is by the error that written in the api
  }
});

// check for POST request for creating new user
it("make a POST request to - https://reqres.in/api/users with all the required user details", async () => {
  console.log("create new user");
  const user = {
    name: "Yuval Mendelovitz",
    job: "QA Engineer",
    age: 22,
    country: "Israel",
  };
  const response = await axios.post(`${url}/users`, user);
  expect(response.status).toEqual(201);
  expect(response.data.name).toEqual(user.name);
  expect(response.data.job).toEqual(user.job);
  expect(response.data.age).toEqual(user.age);
  expect(response.data.age).toEqual(user.age);
});

// check for POST request for creating new user with missing details
it("make a POST request to - https://reqres.in/api/users with missing some if the required user details", async () => {
  console.log("create new user");
  const user = {
    name: "",
    job: "QA Engineer",
    age: 22,
    country: "Israel",
  };
  try {
    const response = await axios.post(`${url}/users`, user);
  } catch (err) {
    expect(err.response.status).toEqual(400);
    expect(err.response.message).toEqual(
      "cannot create user because there are missing required values"
    ); // this is by the error that written in the api
  }
});

// check for POST request for creating new user with invalid details
it("should not create the user and should return error status code like 400", async () => {
  console.log("create new user");
  const user = {
    name: 40, // the error is here (number instead of string)
    job: "QA Engineer",
    age: 22,
    country: "Israel",
  };
  try {
    const response = await axios.post(`${url}/users`, user);
  } catch (err) {
    expect(err.response.status).toEqual(400);
    expect(err.response.message).toEqual(
      "cannot create user because the values are invalid"
    ); // this is by the error that written in the api
  }
});

// make a POST request to this URL but with different Endpoint
it("there is no returned data - the response should be with error (404)", async () => {
  const user = {
    name: "Yuval Mendelovitz",
    job: "QA Engineer",
    age: 22,
    country: "Israel",
  };
  try {
    await axios.post(`${url}/userss`, user);
  } catch (err) {
    expect(err.response.message).toEqual("path not found"); // this is by the error that written in the api
    expect(err.response.status).toEqual(404);
    console.log("the path that you trying to reach is invalid"); // this is by the error that written in the api
  }
});

// try to create many users one after one
it("if the last user not already created - it should return error", () => {
  const user = {
    name: "Yuval Mendelovitz",
    job: "QA Engineer",
    age: 22,
    country: "Israel",
  };
  const user2 = {
    name: "Amit Cohen",
    job: "DevOps",
    age: 40,
    country: "Israel",
  };
  try {
    const response = axios.post(`${url}/users`, user); // not using async await in order to not stop the program until the post is done
    const response2 = axios.post(`${url}/users`, user2);
  } catch (err) {
    expect(err.response.message).toEqual("Too Many Requests"); // this is by the error that written in the api
    expect(err.response.status).toEqual(429);
    console.log(
      "you are trying to do multiple actions, while the previous action didn't already finished"
    ); // this is by the error that written in the api
  }
});

// make a POST request and than make a GET request
it("the user that created is exist on the user list, with the correct details", async () => {
  console.log("create the user");
  const user = {
    name: "Yuval Mendelovitz",
    job: "QA Engineer",
    age: 22,
    country: "Israel",
  };
  const responseForPost = await axios.post(`${url}/users`, user);
  expect(responseForPost.status).toEqual(201);
  expect(responseForPost.data).toHaveProperty("id");
  console.log("get the specific user");
  const response = await axios.get(`${url}/users/${responseForPost.data.id}`); // need to be GET request for user by ID
  expect(response.status).toEqual(200);
  expect(user.data.name).toEqual(responseForPost.data.name);
  expect(user.data.job).toEqual(responseForPost.data.job);
  expect(user.data.age).toEqual(responseForPost.data.age);
  expect(user.data.country).toEqual(responseForPost.data.country);
});

// try to do DELETE, PUT, PATCH
it("verify that it is not allowed (if the http method is not created in the code", async () => {
  console.log("try to put for specific user");
  const fakeUser = {
    name: "blabla",
    job: "bla",
    age: 1,
    country: "blabla",
  };
  try {
    await axios.put(`${url}/users/1`, fakeUser); // letting the user ID value of 1 just for checking
  } catch (err) {
    expect(err.response.status).toEqual(400);
  }
});
