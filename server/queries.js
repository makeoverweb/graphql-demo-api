mutation post($input: PostPhotoInput!) {
  postPhoto(input: $input) {
  id
  url
  postedBy {
  name
  avatar
  }
  }
  }

  query currentUser {
    me {
      githubLogin
        name
        avatar
      }
    }



mutation {
  githubAuth(code: "a397a2c191525936d9c6") {
    token
    user {
      githubLogin
      name
      avatar
    }
  }
}

mutation {
  addFakeUsers(count: 3) {
  name
  }
  }

  {
    "input": {
  "name": "sample photo B",
  "description": "A sample photo for our dataset"
  }
  }

  {
    "Authorization": "8fc65606ebfc6d1351d95d8e0c9c0ffcc4247f7a"
 }

 mutation {
  addFakeUsers(count: 3) {
  name
  }
  }

  mutation {
    fakeUserAuth(githubLogin:"jDoe") {
    token
    }
    }