const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 4500;

app.use(bodyParser.json());

const dbFile = 'database.json';

// Read pets from the database file
const readPetsFromFile = () => {
    if (fs.existsSync(dbFile)) {
        const data = fs.readFileSync(dbFile);
        return JSON.parse(data);
    }
    return [];
};

// Write pets to the database file
const writePetsToFile = (pets) => {
    fs.writeFileSync(dbFile, JSON.stringify(pets, null, 2));
};

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Shop API');
});

// Create a new pet
app.post('/pets', (req, res) => {
    const pets = readPetsFromFile();
    const newPet = req.body;
    pets.push(newPet);
    writePetsToFile(pets);
    res.status(201).send(newPet);
});

// Getting all pets
app.get('/pets', (req, res) => {
    const pets = readPetsFromFile();
    res.send(pets);
});

// Getting a single pet by index
app.get('/pets/:index', (req, res) => {
    const pets = readPetsFromFile();
    const pet = pets[req.params.index];
    if (pet) {
        res.send(pet);
    } else {
        res.status(404).send({ error: 'Pet not found' });
    }
});

// Updating a pet by index
app.put('/pets/:index', (req, res) => {
    const pets = readPetsFromFile();
    const index = req.params.index;
    if (pets[index]) {
        pets[index] = req.body;
        writePetsToFile(pets);
        res.send(pets[index]);
    } else {
        res.status(404).send({ error: 'Pet not found' });
    }
});

// Deleting a single pet by index
app.delete('/pets/:index', (req, res) => {
    const pets = readPetsFromFile();
    const index = req.params.index;
    if (pets[index]) {
        const deletedPet = pets.splice(index, 1);
        writePetsToFile(pets);
        res.send(deletedPet[0]);
    } else {
        res.status(404).send({ error: 'Pet not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
