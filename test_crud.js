require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
    try {
        const timestamp = Date.now();
        const email = `testuser_${timestamp}@example.com`;
        const password = 'password123';

        console.log(`\n--- Starting API Tests on ${BASE_URL} ---`);

        // 1. Register User
        console.log(`\n[1] Registering user: ${email}`);
        await axios.post(`${BASE_URL}/auth/register`, { email, password });
        console.log('✅ User registered successfully');

        // 2. Login User
        console.log(`\n[2] Logging in user: ${email}`);
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        const token = loginRes.data.token;
        console.log('✅ Logged in successfully. Token acquired.');

        const headers = { Authorization: `Bearer ${token}` };

        // 3. Create a Note
        console.log(`\n[3] Creating a new note...`);
        const createRes = await axios.post(`${BASE_URL}/note/add`, {
            title: "My First Test Note",
            content: "This is the content of my very first note."
        }, { headers });
        const noteId = createRes.data.noteId;
        console.log(`✅ Note created with ID: ${noteId}`);

        // 4. Get All Notes
        console.log(`\n[4] Fetching all notes...`);
        const getAllRes = await axios.get(`${BASE_URL}/note/getAll`, { headers });
        console.log(`✅ Found ${getAllRes.data.data.length} notes.`);
        if (getAllRes.data.data.length === 0) throw new Error("Notes list should not be empty");

        // 5. Get Note By ID
        console.log(`\n[5] Fetching note by ID: ${noteId}`);
        const getByIdRes = await axios.get(`${BASE_URL}/note/${noteId}`, { headers });
        console.log(`✅ Note fetched successfully: ${getByIdRes.data.data.title}`);

        // 6. Update Note
        console.log(`\n[6] Updating note ID: ${noteId}`);
        await axios.put(`${BASE_URL}/note/update/${noteId}`, {
            title: "Updated Note Title",
            content: "This content was successfully updated."
        }, { headers });

        const updatedNoteRes = await axios.get(`${BASE_URL}/note/${noteId}`, { headers });
        if (updatedNoteRes.data.data.title !== "Updated Note Title") throw new Error("Update didn't apply!");
        console.log('✅ Note updated successfully');

        // 7. Delete Note
        console.log(`\n[7] Deleting note ID: ${noteId}`);
        await axios.delete(`${BASE_URL}/note/delete/${noteId}`, { headers });
        console.log('✅ Note deleted successfully');

        // 8. Verify Deletion
        console.log(`\n[8] Verifying deletion...`);
        try {
            await axios.get(`${BASE_URL}/note/${noteId}`, { headers });
            throw new Error("Note should have been deleted!")
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.log('✅ Verified: Note is correctly returning 404 (Not Found)');
            } else {
                throw err;
            }
        }

        console.log(`\n🎉 All tests passed successfully!`);

    } catch (error) {
        console.error(`\n❌ Test Failed!`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

runTests();
