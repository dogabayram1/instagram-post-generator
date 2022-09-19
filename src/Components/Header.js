import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Fade from "react-reveal";
import "./spinner.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.makeRequest = this.makeRequest.bind(this);
    this.getData = this.getData.bind(this);
    this.download = this.download.bind(this);

    this.state = {
      loading: false,
      inputValue: "",
      imgloaded: false,
      src: null,
      url: null,
    };
  }

  makeRequest() {
    this.setState((prevState) => ({
      loading: true,
      imgloaded: false,
      src: null,
      url: null,
    }));

    let newRequestValue = this.state.inputValue.replace(" ", "-");

    const url = `https://instagram-post-generator.herokuapp.com/author/${newRequestValue}`;

    fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        if (!response.ok) {
          alert("Invalid Value. Try another name");
          this.setState((prevState) => ({
            loading: false,
            inputValue: "",
          }));
        } else {
          return response.blob();
        }
      })
      .catch((err) => {
        console.log("ERRRORR" + err);

        return;
      })
      .then((blob) => {
        localStorage.setItem("key", URL.createObjectURL(blob));
        this.setState((prevState) => ({
          src: url,
        }));
        return URL.createObjectURL(blob);
      })
      .catch((err) => {
        console.log("ERRRORR" + err);

        return;
      });
  }

  getData(val) {
    this.setState((prevState) => ({
      inputValue: val.target.value,
    }));
  }

  async download() {
    const getBuffer = localStorage.getItem("key");
    const a = document.createElement("a");
    a.href = getBuffer;
    a.download = "instagram.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  render() {
    if (!this.props.data) return null;

    const name = this.props.data.name;
    const description = this.props.data.description;

    return (
      <header id="home">
        <ParticlesBg type="circle" bg={true} />
        <div className="row banner">
          <div className="banner-text">
            <Fade bottom>
              <h1 className="responsive-headline">{name}</h1>
            </Fade>
            <Fade bottom duration={1200}>
              <h3>{description}.</h3>
            </Fade>
            <hr />
            <Fade bottom duration={2000}>
              <ul className="social">
                <input
                  type="text"
                  onChange={this.getData}
                  value={this.state.inputValue}
                ></input>
                {this.state.loading ? (
                  <div className="spinner-container">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <btn
                    className="button btn project-btn"
                    onClick={this.makeRequest}
                  >
                    <i className="fa fa-instagram"></i>Generate
                  </btn>
                )}

                {this.state.imgloaded && (
                  <btn
                    className="button btn project-btn"
                    onClick={this.download}
                    style={{ margin: 10 }}
                  >
                    <i className="fa fa-download"></i>Download
                  </btn>
                )}

                <img
                  onLoad={() =>
                    this.setState({ imgloaded: true, loading: false })
                  }
                  style={
                    this.state.imgloaded
                      ? {
                          width: "100",
                          height: "100",
                          display: "block",
                          margin: "auto",
                        }
                      : { display: "none" }
                  }
                  src={localStorage.getItem("key")}
                  alt="Instagram-Post"
                  width={500}
                  height={500}
                />
              </ul>
            </Fade>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
