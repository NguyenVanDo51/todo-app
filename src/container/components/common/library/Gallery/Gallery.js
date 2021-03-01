import React, { useCallback, useState } from 'react';
// import Gallery from 'react-photo-gallery';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';
import './style.css';

const GalleryImg = ({ photos }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const openLightbox = useCallback((event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    }, []);

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };
    return (
        <div className="chat-galery-container">
            <Gallery photos={photos} onClick={openLightbox} />
            <ModalGateway>
                {viewerIsOpen ? (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={currentImage}
                            styles={{ width: '40px', height: '40px' }}
                            views={photos.map((x) => ({
                                ...x,
                                srcset: x.srcSet,
                                caption: x.title,
                            }))}
                        />
                    </Modal>
                ) : null}
            </ModalGateway>
        </div>
    );
};

export default GalleryImg;
