import React, {Component} from 'react';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';

import './login.scss';
class Login extends Component {
  render() {
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
            onSubmit={values => {
              values.target.reset();
              console.log('submit login');
              setPageName('LOGIN');
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
            </Form>
          </Formik>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentProfilePage: state.currentProfilePage
  }
}

export default connect(mapStateToProps, actions)(Login);