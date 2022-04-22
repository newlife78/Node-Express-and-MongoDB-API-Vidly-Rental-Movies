# Vidly API (imaginary service for rent out movies):

Start the API :

1. 'npm i' (install the necessary dependencies for this API. See 'package.json').

2. Install 'MongoDB Community Server', 'MongoDB Compass' and 'MongoDB Database Tools' in your computer (see: 'https://www.mongodb.com/')
   NOTE: 'MongoDB Community Server' and 'MongoDB Compass' should be installed separately (remove the check sign in 'MongoDB Community Server', during installation)

3. Chose wht script you wish to run:

3.1. 'npm run test_One' (to run the API in a test environment)
3.2. 'npm run test_Two' (to run the API in a test environment + COVERAGE)
3.3. 'npm run dev' (to run the API in a development environment)
3.4. 'npm start' (to run the API in a production environment)

4. Set an environment password to 'VIDLY_JWT_PRIVATE_KEY':

4.1. Chose a CMD Terminal: Go to ‘Terminal’ tag --> chose ‘Command Prompt’
4.2. Create the environement variable: ‘ set<variable-name>=<variable-value> ’ (WITHOUT space near the equal sign. Ex: 'set VIDLY_JWT_PRIVATE_KEY=XXXXXXX')

5. For security is better to change:

5.1. Ports numbers set in 'test.json', 'development.json' and 'production.json' files.

---

Check the results in the final end points:

- Obtain all the genres: 'http://localhost:1234/api/genres' ('1234' represents the PORT number)

- Returns the genre for the given 'id' or 'not found' if it doesn't belong to list:'http://localhost:1234/api/genres/:id' (:id = 1, 2, 3)

- Obtain all the genres: 'http://localhost:1234/api/customers' ('1234' represents the PORT number)

- Returns the customer for the given 'id' or 'not found' if it doesn't belong to list:'http://localhost:1234/api/genres/:id' ('1234' represents the PORT number)

- Test 'POTS', 'PUT' and 'DELETE' methods: use 'Postman' app for testing (IMPORTANT NOTE: 'Postman' desktop app must be installed in your computer.)

---

Purpose:

Create a rental movie application where it is possible to manage, create, change and delete a list of movies, genres, rentals, customers and users.

---

This API uses 'EXPRESS.js' and the CRUD operations (Create, Read, Update and Delete):

- GET
- POST
- PUT
- DELETE
