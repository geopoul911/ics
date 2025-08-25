import React from 'react';
import NavigationBar from '../../core/navigation_bar/navigation_bar';
import Footer from '../../core/footer/footer';
import ClientList from './client_list';

const Clients = () => {
  return (
    <>
      <NavigationBar />
      <div className="rootContainer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <ClientList />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Clients;
