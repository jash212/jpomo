import { useEffect, useState } from "react";
import { Fade } from "react-bootstrap";

function AboutInfo(props: any) {    
    return (
        <Fade in={ !props.hideAbout } timeout={ 1000 }>
            <div className="about-background position-absolute w-100 h-100">
                <div className="position-absolute top-50 start-50 translate-middle">
                    <div className='continer-lg  bg-white rounded p-1'> 
                        <div className="position-absolute top-0 end-0">
                            <button 
                                className="btn p-1 mx-1"
                                onClick={ () => props.setHideAbout(true) }
                            > 
                                <i className="fa fa-solid fa-close fa-2x"></i>
                            </button>
                        </div>
                        <div className="row my-3 p-2"> </div>
                        <div className="row m-2 p-2">
                            <div className="col">
                                <img 
                                    className="jump"
                                    src="favicon.ico" 
                                    alt="about" 
                                    width="80" 
                                    height="80"
                                />
                            </div>
                            <div className="col">
                                <h1 className="p-1" style={{ fontSize: "56px", marginLeft: "50px"}}> jPomo </h1>
                            </div>
                        </div>
                        <div className="d-flex row">
                            <p className="text-center"> Created by Joshua Coult</p>
                        </div>
                        <div className="d-flex row">
                            <a className='text-center' href="https://github.com/jash212" target='_blank'> jash212 <i className='fa fa-github' style={{fontSize: "20px"}}></i></a>
                        </div>
                        <div className="row my-1 p-2"> </div>
                    </div>
                </div>
            </div>
        </Fade>
    );
}


export default function About() {
    const [imgClass, setImgClass] = useState("");
    const [hideAbout, setHideAbout] = useState(true);
    const [visible, setVisible] = useState(false);

    // timeout to give the about window time to fade out before making it invisible
    useEffect(() => {
        if (hideAbout) {
            setTimeout(() => { setVisible(false) }, 1000);
        } else {
            setVisible(true);
        }
    }, [hideAbout]);
    
    return (
    <>
        <div className='position-absolute top-0 end-0 m-1'
        style={{ width: "40px", height: "40px"}}
        onMouseEnter={ () => setImgClass("bounce")}
        onMouseLeave={ () => setImgClass("")}
        onClick={ () => setHideAbout(false)}
        >
            <img 
                className={ imgClass } 
                src="favicon.ico" 
                alt="about" 
                width="40" 
                height="40"
            />
        </div>
        
        <div className={ visible ? "visible" : "invisible" }>
            <AboutInfo hideAbout={ hideAbout } setHideAbout={ setHideAbout } />
        </div>
    </>
    );
}