import requests

BASE_URL = 'http://localhost:5000/api/contributions'

def post_create_contribution(contribution_data):
    response = requests.post(f'{BASE_URL}', json=contribution_data)
    return response.json()

def main():
    while True:
        print('Choose an action:')
        print('1. Create a new contribution')
        print('2. Quit')
        
        choice = input('Enter your choice: ')
        
        if choice == '1':
            contribution_data = {
                "contributorAddress": "Contributor1",
                "projectTitle": "Project Title",
                "contributionAmount": 50,
                "user": "User1"
            }
            response = post_create_contribution(contribution_data)
            print(response)
            
        elif choice == '2':
            break

if __name__ == "__main__":
    main()
