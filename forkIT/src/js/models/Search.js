import axios from 'axios';

// Creating Search class
export default class Search {
    constructor(query) {
        this.query = query;
    }

    // Get results method for AJAX
    async getResults() {
        try {
            // Making AJAX using axios
            const results = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);

            // recived JSON 
            this.result = results.data.recipes;
            
        } catch(error) {
            console.log(error);
        }

    }
}