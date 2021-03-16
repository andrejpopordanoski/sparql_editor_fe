import imagePlaceholder from 'assets/images/Backgrounds/Listings/placeholder.jpg';

export const handleImageSourceError = event => {
    event.target.src = imagePlaceholder;
};
