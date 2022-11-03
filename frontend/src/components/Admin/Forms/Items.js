import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import {Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import Service from '../../../service/service';
import RichEditorExample from '../../TextEditor/TextEditor';

import './form.scss';
class ItemsForm extends Component {
  timeoutClearMessage = null;
  timeoutHideModal = null;

  onHandleSubmit = (data) => {
    this.props.loginFetching();
    new Service().adminCreateItem('/coffee', data, {"Authorization": `Bearer ${this.props.authToken}`})
    .then(res => {
      /* localStorage.setItem('userProfileFields', JSON.stringify(res.user));
      this.props.setUserProfileFields(res.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('login', true); */
      console.log(res)
      /* this.timeoutHideModal = setTimeout(() => {
        this.props.loginFetched();
        this.props.setPageName('PAGE HIDE');
        this.props.isLogin(true);
        this.props.setAuthToken(res.token);
      }, 1000); */
    })
    .catch((e) => {
      console.log(e)
      /* this.props.loginFetchingErr();
      this.timeout = setTimeout(() => {
        this.props.loginFetched();
      }, 3000); */
    })
  }

  componentWillUnmount() {
    //clearTimeout(this.timeoutClearMessage);
    //clearTimeout(this.timeoutHideModal);
  }

  render() {
    const {setPageName} = this.props;
    return (
      <div className="modal">
        <RichEditorExample />

        <div className="wrapper">
          <div className="close" onClick={() => setPageName('PAGE HIDE')}>x</div>
          <h3>Create item</h3>
          <Formik
            initialValues = {{
              title: '',
              description: ''
            }}

            validationSchema = {Yup.object({
              title: Yup.string()
                      .min(2, 'Min characters for title must be 5')
                      .required('Its field is required'),
                      description: Yup.string()
                      .min(2, 'Min characters for desc must be 10')
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
                id="title"
                name="title"
                type="text"
                placeholder={'Enter title'}
                >
              </Field>
              <FormikErrorMessage name="email" style={{padding: 5, display: 'block'}} component="p" />
              <Field
                id="description"
                name="description"
                type="textarea"
                placeholder={'Enter description'}
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
    authToken: state.authToken
  }
}
export default connect(mapStateToProps, actions)(ItemsForm);