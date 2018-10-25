import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Select from 'react-select';

import PhotoDisplay from './components/PhotoDisplay';
import MapComponent from './components/MapComponent';

class App extends Component {
  constructor(){
    super();

    this.state = {
      photos: [],
      isEnd: false,
      loading: false,
      page: 1,
      filterMinDate: moment("01/01/2000"),
      filterMinDateUnix: moment("01/01/2000").unix(),
      filterMaxDate: moment(),
      filterMaxDateUnix: moment().unix(),
      error: '',
      options: [
        { value: '0', label: '1: All Rights Reserved' },
        { value: '1', label: '2: Attribution-NonCommercial-ShareAlike License' },
        { value: '2', label: '3: Attribution-NonCommercial License' },
        { value: '3', label: '4: Attribution-NonCommercial-NoDerivs License' },
        { value: '4', label: '5: Attribution License' },
        { value: '5', label: '6: Attribution-ShareAlike License' },
        { value: '6', label: '7: Attribution-NoDerivs License' },
        { value: '7', label: '8: No known copyright restrictions' },
        { value: '8', label: '9: United States Government Work' },
        { value: '9', label: '10: Public Domain Dedication (CC0)' },
        { value: '10', label: '11: Public Domain Mark' }
      ],
      selectedItems: [
        { value: '0', label: '1: All Rights Reserved' },
        { value: '1', label: '2: Attribution-NonCommercial-ShareAlike License' },
        { value: '2', label: '3: Attribution-NonCommercial License' },
        { value: '3', label: '4: Attribution-NonCommercial-NoDerivs License' },
        { value: '4', label: '5: Attribution License' },
        { value: '5', label: '6: Attribution-ShareAlike License' },
        { value: '6', label: '7: Attribution-NoDerivs License' },
        { value: '7', label: '8: No known copyright restrictions' },
        { value: '8', label: '9: United States Government Work' },
        { value: '9', label: '10: Public Domain Dedication (CC0)' },
        { value: '10', label: '11: Public Domain Mark' }
      ]
    }

    this.searchPhotos = this.searchPhotos.bind(this);
    this.changeMinDate = this.changeMinDate.bind(this);
    this.changeMaxDate = this.changeMaxDate.bind(this);

    //infinite scroll
    window.onscroll = () => { 
      if ( window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight ) {
        this.searchPhotos();
      } 
    }
  }

  componentDidMount(){
    this.searchPhotos();
  }

  searchPhotos = (photoList = this.state.photos, page = this.state.page) => { //by default photoList is state, for infinite scroll, but after change the filter, we reset it by providing empty array, by default page is from state, but we can pass 0 to start from first page after change in filters
    const licenseList = this.licenseList();
    if(licenseList === false){
      this.setState({ 
        error: 'No license selected!',
        photos: [],
        page: 1 
      }); //if returned false, then show error
    } else {
      this.setState({ loading: true, error: '' }, () => {

        axios.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=06f4e4b9f08bbf02355e3c11fc871923&text=dogs&format=json&nojsoncallback=1&per_page=100&extras=description,date_upload,owner_name,geo,url_q,license&page=${this.state.page}&min_upload_date=${this.state.filterMinDateUnix}&max_upload_date=${this.state.filterMaxDateUnix}&license=${licenseList}`)
        .then((result) => {

          result.data.photos.photo.map((photo) => {
            const newPhoto = {
              id: photo.id,
              date: photo.dateupload,
              title: photo.title,
              description: photo.description._content,
              latitude: photo.latitude,
              longitude: photo.longitude,
              url: photo.url_q
            };
            return photoList = [ ...photoList, newPhoto]; //return updated list of photos
            
          });          

          if(result.data.photos.total === "0") { //if no photos found, then show error
            this.setState({ 
              photos: photoList,
              isEnd: false,
              loading: false, 
              error: 'Photos not found!',
              page: 1 
            });
          }
          else if(result.data.photos.page === result.data.photos.pages) { //if it's last page
            this.setState({
              photos: photoList,
              isEnd: true,
              loading: false, 
              error: 'All photos loaded!',
              page: page+1 //next page to load
            });
          } 
          else {
            this.setState({
              photos: photoList,
              loading: false, 
              error: '',
              page: page+1 //next page to load
            });

          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            photos: [],
            loading:false,
            error: error,
            page:1
          });
        });
      });
    }
  }

  //list of license as string
  licenseList() {
    const licenses = []; //list of license selected 
    if(this.state.selectedItems.length === 0) { 
      return false; //if no license selected, then return false
    }
    this.state.selectedItems.map(
      license => licenses.push(license.value) //insert license ID to array 
    );    
    return licenses.join(); //convert array to string
  }

  /*
   * Filters
   */

  //Change min. date
  changeMinDate(date) {
    const minDateUnix = moment(date).unix(); //convert date to unix format
    this.setState({
      photos: [],
      page: 1,
      filterMinDate: date,
      filterMinDateUnix: minDateUnix,
      error: ''
    });
    this.searchPhotos([], 0); //search photos, delete previous photos, reset page
  }

  //Change max. date
  changeMaxDate(date) {
    const maxDateUnix = moment(date).unix(); //convert date to unix format
    this.setState({
      photos: [],
      page: 1,
      filterMaxDate: date,
      filterMaxDateUnix: maxDateUnix,
      error: ''
    });
    this.searchPhotos([], 0); //search photos, delete previous photos, reset page
  }

  //Change licenses
  licenseChange = (selectedItems) => {
    this.setState({ selectedItems }, () => { this.searchPhotos([], 0) }); //after setState is finished, delete previous photos
  }

  render() {
    const { loading, filterMinDate, filterMaxDate, selectedItems, error, options } = this.state;
    /* const options = [
      { value: '0', label: '1: All Rights Reserved' },
      { value: '1', label: '2: Attribution-NonCommercial-ShareAlike License' },
      { value: '2', label: '3: Attribution-NonCommercial License' },
      { value: '3', label: '4: Attribution-NonCommercial-NoDerivs License' },
      { value: '4', label: '5: Attribution License' },
      { value: '5', label: '6: Attribution-ShareAlike License' },
      { value: '6', label: '7: Attribution-NoDerivs License' },
      { value: '7', label: '8: No known copyright restrictions' },
      { value: '8', label: '9: United States Government Work' },
      { value: '9', label: '10: Public Domain Dedication (CC0)' },
      { value: '10', label: '11: Public Domain Mark' }
    ]; */
    return (     
        <section className="section">
          <div className="columns is-multiline">
          <div className="column is-2">
            <label>From date:
              <DatePicker
                selected={filterMinDate}
                onChange={this.changeMinDate}
              />
            </label>
          </div>
          <div className="column is-2">
            <label>To date:
              <DatePicker
                selected={filterMaxDate}
                onChange={this.changeMaxDate}
              />
            </label>
          </div>
          <div className="column is-8">
            <label>License:
              <Select 
                value={selectedItems} 
                options={options} 
                isMulti={true} 
                onChange={this.licenseChange}
              />
            </label>
          </div>
          <div className="column is-4">
              <div className="mapcontainer">
                <MapComponent markers={this.state.photos} />
              </div>
          </div>
          <div className="column is-8 columns is-multiline is-mobile photo-container">
            { this.state.photos.map((photo) => {
              return <PhotoDisplay key={photo.id}  id={photo.id} url={photo.url} title={photo.title} date={photo.date}/>               
            }) }
            { loading ? <div className="loading">Loading...</div> : <div className="error">{ error }</div> }
            
          </div>
        </div>
      </section>        
    );
  }
}

export default App;
