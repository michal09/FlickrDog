import React from 'react';
import moment from 'moment';

const PhotoDisplay = ({url, title, date}) => {
    
        return (
            <div className="column is-4-mobile  is-4-tablet is-2-desktop photo-card">
                <img src={url} alt={title} />
                <span className="photo-title">{title}</span>          
                <span className="photo-date">{moment(parseInt(date)*1000).format("DD MMM YYYY hh:mm a")}</span>      
            </div>
        );

}

export default PhotoDisplay;