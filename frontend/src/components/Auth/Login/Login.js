import React, {Component} from 'react';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import Service from '../../../service/service';
import './login.scss';
class Login extends Component {
  timeoutClearMessage = null;
  timeoutHideModal = null;
  onHandleSubmit = (data) => {
    this.props.loginFetching();
    new Service().userLogin(data)
    .then(res => {
      console.log(res)
      localStorage.setItem('token', res.token);
      this.timeoutHideModal = setTimeout(() => {
        this.props.loginFetched();
        this.props.setPageName('PAGE HIDE');
        this.props.isLogin(true);
        this.props.setAuthToken(true);
        document.location.reload();
      }, 3000);
    })
    .catch((e) => {
      console.log(e)
      this.props.loginFetchingErr();
      this.timeout = setTimeout(() => {
        this.props.loginFetched();
      }, 3000);
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutClearMessage);
    clearTimeout(this.timeoutHideModal);
  }

  render() {
    console.log(this.state);
    const {setPageName} = this.props;
    return (
      <div className="modal">
        <div className="wrapper">
          <div className="close" onClick={() => setPageName('PAGE HIDE')}>x</div>
          <h3>Login</h3>
          <Formik
            initialValues = {{
              email: '',
              password: ''
            }}

            validationSchema = {Yup.object({
              email: Yup.string()
                      .min(2, 'Min characters for name must be 2')
                      .required('Its field is required'),
              password: Yup.string()
                      .min(2, 'Min characters for name must be 2')
                      .required('Its field is required'),
            })}

            onSubmit={(values, {resetForm}) => {
              console.log('submit login');
              this.onHandleSubmit(values);
              resetForm();
            }}
            
            >
              <Form>
              <Field
                id="email"
                name="email"
                type="text"
                placeholder={'Enter email'}
                >
              </Field>
              <FormikErrorMessage name="email" style={{padding: 5, display: 'block'}} component="p" />
              <Field
                id="password"
                name="password"
                type="password"
                placeholder={'Enter password'}
                >
              </Field>
              <FormikErrorMessage name="password" style={{padding: 5, display: 'block'}} component="p" />
              <div className="form-buttons">
                <button type="submit" 
                  className="button"
                  
                  >
                  Submit
                </button>
              </div>
              <div className="message">
                {this.props.loginStatus === 'loading' ? 'loading' : null}
                {this.props.loginStatus === 'err' ? 'Your password or email not correctly' : null}
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentProfilePage: state.currentProfilePage,
    loginStatus: state.loginStatus
  }
}

export default connect(mapStateToProps, actions)(Login);