import axios from 'axios';
import {API} from '../../../config' 

// Creating Search class
export default class Search {
    constructor(query) {
        this.query = query;
    }

    // Get results method for AJAX
    async getResults() {
        try {
            // Making AJAX using axios
            const results = await axios(`${API}/search?q=${this.query}`);

            // recived JSON 
            this.result = results.data.recipes;
            
        } catch(error) {
            console.log(error);
        }

    }
}