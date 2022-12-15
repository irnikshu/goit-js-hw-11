
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { ServerAPI } from "./js/fetchPhoto";
import { createGallery } from "./js/createGallery";
import { Notify } from "notiflix";
import './css/styles.css';
import {refs} from "./js/reffs";

refs.form.addEventListener("submit", onSearch);
refs.loadMoreBtn.addEventListener("click", onLoadMore);

const serverApi = new ServerAPI();

refs.loadMoreBtn.setAttribute('disabled', true);

let page = 1;

async function onSearch(e) {
    e.preventDefault();
refs.loadMoreBtn.classList.add('is-hidden');
   

    const { elements: { searchQuery },
    } = e.currentTarget;

    const searchValue = searchQuery.value.trim()
   
  if (!searchValue) {
    Notify.failure('Select a picture category please');
    return;
  }
    page = 1;
    serverApi.query = searchValue;
    const data = await serverApi.fetchPhoto(page);

    if (data.hits.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
    }


    
Notify.success(`Hooray! We found ${data.totalHits} images.`)

    const markup = createGallery(data.hits);
    refs.gallery.innerHTML = markup;

    lightbox.refresh();
   
  
    
     if (page < data.totalHits / 40) {
        refs.loadMoreBtn.removeAttribute('disabled');
    
       
         
    } 
    if (page >= data.totalHits / 40) {
    refs.loadMoreBtn.setAttribute('disabled', true);
   
    }
    refs.form.reset();
  
  
}

async function onLoadMore(e) {
    page += 1;
   
   

   const data = await serverApi.fetchPhoto(page);

   

const markup = createGallery(data.hits);

    refs.gallery.insertAdjacentHTML("beforeend", markup);
     lightbox.refresh();
    page += 1;

    const totalPage = await data.totalHits / 40;
    if (page >= totalPage) {
        

        Notify.info("We're sorry, but you've reached the end of search results.");
        refs.loadMoreBtn.setAttribute('disabled', true);
    }
    await smoothScroll();
}

async function smoothScroll() {
  const { height: cardHeight } = refs.gallery
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const lightbox = new SimpleLightbox('.gallery a',
    {
        captionsData: "alt",
        captionPosition: "bottom",
        captionDelay: 250,
        overlayOpacity: 0.8,
        closeText: '×',
          scrollZoom: false,
    });



