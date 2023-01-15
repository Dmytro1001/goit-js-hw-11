import axios from "axios";

export default async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/';
    const key = '32853375-6d84d4cb4ca61249f5fce654b';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  const photos = await axios.get(`${url}${filter}`).then(resp => resp.data);

  return photos;
}