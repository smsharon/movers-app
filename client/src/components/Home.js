import React from "react";
import "./Home.css";
import Footer from './Footer';

const Home = () => {
    return (
        <div>
        <section className="home-wrapper">
            <div className="paddings innerwidth flexCenter home-container">
                <div className="flexColStart home-left">
                    <div className="home-title">
                        <div className="orange-circle" />
                        <h1>
                            Discover <br /> Most Suitable <br /> Mover
                        </h1>
                    </div>
                    <div className="flexColStart home-des">
                        <span className="secondaryText">Find a variety of movers that are to your liking</span>
                        <span className="secondaryText">Do you want your moving business to grow? Find variety of customers ready to move</span>
                    </div>
                </div>
                
                <div className="flexCenter home-right">
                    <div className="image-container">
                        <img src="./home.jpg" alt="home" />
                    </div>

                </div>
            </div>
            
        </section>
        <Footer />
        </div>
    )
};


export default Home;