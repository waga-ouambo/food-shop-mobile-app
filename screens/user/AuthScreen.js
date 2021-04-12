import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Text, ScrollView, KeyboardAvoidingView, TextInput, Button, ActivityIndicator, Alert} from 'react-native';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Color';
import { Formik, ErrorMessage  } from 'formik'
import * as Yup from 'yup';
import { LinearGradient} from 'expo-linear-gradient';
import {useDispatch} from 'react-redux';
import * as authAction from '../../store/actions/authAction';

const AuthScreen = props => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);

 

    const loginFormSchema = Yup.object({
        email: Yup.string()
        .trim()
        .required() 
        .email()
        .min(3, "email must be 3 characters at minimum"), 
    
        password: Yup.string() 
        .required() 
        .required('Password is required !')
        .min(4, "Password must be 4 characters at minimum") 
    }) 


    const authHandler = async (values, actions) => {
        setIsLoading(true);
        setError(null);
        try { 
            if(isSignup) {
                await   dispatch(authAction.signup(values.email, values.password));
            }else{
                await   dispatch(authAction.login(values.email, values.password));
                props.navigation.navigate('Shop');
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
       
    }

    useEffect(() => {
        if(error){
            Alert.alert('An Error Occured', error, [{text: 'Okay'}])
        } 
    }, [error]);

   


        return (
            <Formik
            initialValues={{
                email:'',
                password:'' 
            }}
            onSubmit={(values, actions) => {authHandler(values, actions)}}
            validationSchema={loginFormSchema}
            validateOnChange={true}
        >
             { ({ handleChange, handleSubmit, handleBlur, values, errors, isValid, touched, dirty }) => 
             {
               
           return (  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
                    style={styles.screen}
                    >
                    <LinearGradient colors={['#C2185B', '#ffe3ff']} style={styles.gradient} >
                <Card style={styles.authContainer}> 
                {error &&  
                    <View style={styles.centered}>
                            <Text style={{color: Colors.primary}}> {error} </Text> 
                            </View>
                        }
                    <ScrollView>
                    <View style={styles.formControl}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput  
                        style={styles.input}  
                        value={values.email}   
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        touched={touched.email}
                        keyboardType='email-address' 
                        secureTextEntry
                        autoCorrect
                        error={errors.email} 
                        // onEndEditing={() => { console.log('onEndEditing email')}}
                        onSubmitEditing={() => { console.log('onSubmitEditing email')}}
                        name="email"
                        placeholder="Enter your email"
                        />
                    </View> 
                    {errors.email && <Text style={{color: Colors.primary, fontFamily: 'open-sans-bold'}}><ErrorMessage name="email" /></Text> }
                    <View style={styles.formControl}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput  
                        style={styles.input}  
                        value={values.password}  
                        secureTextEntry 
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        touched={touched.password}
                        keyboardType='default'  
                        error={errors.password} 
                        // onEndEditing={() => { console.log('onEndEditing password')}}
                        onSubmitEditing={() => { console.log('onSubmitEditing password')}}
                        name="password"
                        placeholder="Password"
                        /> 
                    </View> 
                    {errors.password && <Text style={{color: Colors.primary, fontFamily: 'open-sans-bold'}}><ErrorMessage name="password" /></Text> }
                        <View style={styles.butonContainer}>
                        {isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> : 
                            <Button 
                            title={isSignup ? 'Sign Up' : 'Login'} 
                            color={Colors.primary} 
                            disabled={!(dirty && isValid)} onPress={handleSubmit} />
                        }
                        </View> 
                        <View style={styles.butonContainer}>
                            <Button 
                            title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`} 
                            color={Colors.accent} 
                            onPress={() =>{ setIsSignup(prevState => !prevState)
                            } }
                            />   
                        </View> 
                    </ScrollView>
                </Card>
                </LinearGradient>
           </KeyboardAvoidingView> )
             }}
            </Formik>

)}

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
    },
    gradient: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    formControl: {
        width: '100%',
    },
    
    butonContainer: {
        marginTop: 10
    },
    input: {
        paddingHorizontal: 2,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
      },
});

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

export default AuthScreen;