// Global app controller
import Search from './models/Search';
import {elements, renderLoader, deleteLoader} from './views/base';
import * as searchView from './views/searchView';

// State
const state = {};

// Search controller
const controlSearch = async () => {
    // 1. Get the query
    const query = searchView.getInput();

    if (query) {
        // 2. New search object add to state
        state.search = new Search(query);

        // 3. Prepare the UI for results
        renderLoader(elements.searchResults);
        searchView.clearInput();
        searchView.clearResults();

        // 4. Search for recipe
        await state.search.getResults();

        // 5. Render results on UI
        deleteLoader();
        searchView.renderResults(state.search.result);
    }
}

// Adding event listener to search button
elements.searchBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
})

