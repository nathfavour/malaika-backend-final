import requests

BASE_URL = 'http://localhost:5000/api/projects'

def post_create_project(project_data):
    response = requests.post(f'{BASE_URL}', json=project_data)
    return response.json()

def get_all_projects():
    response = requests.get(f'{BASE_URL}')
    return response.json()

def put_update_project(user, update_data):
    response = requests.put(f'{BASE_URL}/{user}', json=update_data)
    return response.json()

def put_update_project_user(address, project_title):
    response = requests.put(f'{BASE_URL}/update-user/{address}/{project_title}')
    return response.json()

def get_projects_without_user():
    response = requests.get(f'{BASE_URL}/projects-without-user')
    return response.json()

def delete_project(address, project_title):
    response = requests.delete(f'{BASE_URL}/{address}/{project_title}')
    return response.json()

def get_project_contributors(address, project_title):
    response = requests.get(f'{BASE_URL}/fetch-contributors/{address}/{project_title}')
    return response.json()

def post_return_contributions(contributions):
    response = requests.post(f'{BASE_URL}/return-contributions', json=contributions)
    return response.json()

def get_projects_by_user(address):
    response = requests.get(f'{BASE_URL}/user/{address}')
    return response.json()

def main():
    while True:
        print('Choose an action:')
        print('1. Create a new project')
        print('2. Get all projects')
        print('3. Update project details')
        print('4. Update project user')
        print('5. Get projects without user')
        print('6. Delete a project')
        print('7. Get project contributors')
        print('8. Return contributions')
        print('9. Get projects by user')
        print('10. Quit')
        
        choice = input('Enter your choice: ')
        
        if choice == '1':
            project_data = {
                "nickname": "Test Project",
                "projectTitle": "Project Title",
                "projectDescription": "Test project description",
                "projectCategory": "Test Category",
                "amountToRaise": 10000,
                "minimumBuyIn": 100,
                "roi": 5,
                "stakeAmount": 10,
                "photo": "project.jpg"
            }
            response = post_create_project(project_data)
            print(response)
            
        elif choice == '2':
            projects = get_all_projects()
            print(projects)
            
        elif choice == '3':
            user = input('Enter user address: ')
            update_data = {
                "projectTitle": "Updated Title",
                "projectDescription": "Updated description"
            }
            response = put_update_project(user, update_data)
            print(response)
            
        elif choice == '4':
            address = input('Enter new user address: ')
            project_title = input('Enter project title: ')
            response = put_update_project_user(address, project_title)
            print(response)
            
        elif choice == '5':
            projects_without_user = get_projects_without_user()
            print(projects_without_user)
            
        elif choice == '6':
            address = input('Enter user address: ')
            project_title = input('Enter project title: ')
            response = delete_project(address, project_title)
            print(response)
            
        elif choice == '7':
            address = input('Enter user address: ')
            project_title = input('Enter project title: ')
            response = get_project_contributors(address, project_title)
            print(response)
            
        elif choice == '8':
            contributions = [
                {
                    "contributorsAddress": "Contributor1",
                    "projectTitle": "Project Title",
                    "contributionAmount": 50,
                    "user": "User1"
                },
                {
                    "contributorsAddress": "Contributor2",
                    "projectTitle": "Project Title",
                    "contributionAmount": 30,
                    "user": "User2"
                }
            ]
            response = post_return_contributions(contributions)
            print(response)
            
        elif choice == '9':
            address = input('Enter user address: ')
            projects_by_user = get_projects_by_user(address)
            print(projects_by_user)
            
        elif choice == '10':
            break

if __name__ == "__main__":
    main()
