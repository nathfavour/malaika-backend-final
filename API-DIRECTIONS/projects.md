## Example 1: Create a New Project
Send a POST request to create a new project.

bash

curl -X POST -H "Content-Type: application/json" -d '{
  "nickname": "MyProject",
  "projectTitle": "Project ABC",
  "projectDescription": "This is a sample project",
  "projectCategory": "Technology",
  "amountToRaise": 10000,
  "minimumBuyIn": 100,
  "roi": 5,
  "stakeAmount": 200,
  "photo": "project.jpg"
}' http://localhost:3000/api/projects

## Example 2: Get All Projects
Send a GET request to retrieve all projects.

bash

curl http://localhost:3000/api/projects

## Example 3: Update Project Details
Send a PUT request to update project details for a specific user.



curl -X PUT -H "Content-Type: application/json" -d '{
  "projectTitle": "Project ABC",
  "projectDescription": "Updated description"
}' http://localhost:3000/api/projects/user/user123

## Example 4: Update Project's User Field
Send a PUT request to update the user field of a specific project.

bash

curl -X PUT http://localhost:3000/api/projects/update-user/user456/Project%20XYZ

## Example 5: Get Projects Without User Address
Send a GET request to retrieve projects without defined user addresses.

bash

curl http://localhost:3000/api/projects/projects-without-user

## Example 6: Delete a Project
Send a DELETE request to delete a project by address and project title.

bash

curl -X DELETE http://localhost:3000/api/projects/user/user123/Project%20ABC

## Example 7: Get Deleted Project's Contributors
Send a GET request to retrieve contributors for a deleted project.

bash

curl http://localhost:3000/api/projects/fetch-contributors/user123/Project%20ABC

## Example 8: Return Contributions After Delete
Send a POST request to return contributions after deleting a project.

bash

curl -X POST -H "Content-Type: application/json" -d '[
  {
    "contributorsAddress": "contributor1",
    "projectTitle": "Project ABC",
    "contributionAmount": 100,
    "user": "user123"
  }
]' http://localhost:3000/api/projects/return-contributions

## Example 9: Get Projects by User Address
Send a GET request to retrieve all projects associated with a specific user address.

bash

curl http://localhost:3000/api/projects/user/user123
