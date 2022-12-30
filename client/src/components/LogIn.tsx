// eslint-disable-next-line
import * as React from 'react'
import Auth from '../auth/Auth'
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
}
from 'mdb-react-ui-kit';

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6'>

          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="camera fa-3x me-3" style={{ color: '#709085' }}/>
            <span className="h1 fw-bold mb-0">Blogs</span>
          </div>

          <div className=' h-custom-2 w-75 pt-4'>

            {/* <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3> */}

            {/* <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='formControlLg' type='email' size="lg"/>
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='formControlLg' type='password' size="lg"/> */}

            <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg' onClick={this.onLogin}>Login</MDBBtn>
            {/* <p className="small mb-5 pb-lg-3 ms-5"><a class="text-muted" href="#!">Forgot password?</a></p>
            <p className='ms-5'>Don't have an account? <a href="#!" class="link-info">Register here</a></p> */}

          </div>

        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828"
            onClick={this.onLogin}  alt="Login" className="w-100" style={{objectFit: 'cover', objectPosition: 'left'}} />
        </MDBCol>

      </MDBRow>

    </MDBContainer>
    )
  }
}