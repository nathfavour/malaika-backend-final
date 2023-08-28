## Example 1: Create a New Contribution
Send a POST request to create a new contribution and update project information.

bash

bash

curl -X POST -H "Content-Type: application/json" -d '{
  "contributorAddress": "0xContributor123",
  "projectTitle": "Project XYZ",
  "contributionAmount": 200,
  "user": "user456"
}' http://localhost:3000/api/contributions

## Example 2: Missing Contributor Address
Send a POST request without providing a contributor address, triggering a validation error.

bash

bash

curl -X POST -H "Content-Type: application/json" -d '{
  "projectTitle": "Project XYZ",
  "contributionAmount": 200,
  "user": "user456"
}' http://localhost:3000/api/contributions

## Example 3: Successful Contribution
After successfully creating a contribution, you'll receive a response confirming the contribution and updated project information.

Response:

json

json

{
  "contribution": {
    "_id": "612b54e77d564f1e84f4a9e9",
    "contributorAddress": "0xContributor123",
    "projectTitle": "Project XYZ",
    "contributionAmount": 200,
    "user": "user456",
    "createdAt": "2021-08-29T12:34:55.789Z",
    "__v": 0
  },
  "project": {
    "_id": "612b54e77d564f1e84f4a9ea",
    "user": "user456",
    "projectTitle": "Project XYZ",
    "totalContributors": 1,
    "totalContribution": 200,
    "createdAt": "2021-08-29T12:34:55.849Z",
    "__v": 0
  }
}

## Example 4: Project Not Found
If the specified project is not found, you'll receive an error response.

Response:

json

json

{
  "msg": "Project not found"
}

## Example 5: Server Error
If there's a server error during the contribution process, you'll receive an error response.

Response:

json

json

{
  "error": "Server Error"
}
