import axios from 'axios';

export class ServerAPI {
    #BASE_URL = 'https://pixabay.com/api/';
    #KEY_SUCSESS = '31927984-d7f8c8a904e38a53072577433';
    
    #query = '';
    
    get query() {
        return this.#query;
    }

    set query(newQuery) {
        this.#query = newQuery;
    }

    async fetchPhoto(page) {
        const { data } = await axios.get(
            `${this.#BASE_URL}?key=${this.#KEY_SUCSESS}&q=${this.#query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
      
    
        return data;
    }
}