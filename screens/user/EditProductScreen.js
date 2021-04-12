import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, Platform, Button, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import {  ScrollView, TextInput } from 'react-native-gesture-handler';
import {Ionicons} from '@expo/vector-icons';

import {HeaderButtons, Item} from 'react-navigation-header-buttons'; 

import HeaderButton from '../../components/UI/HeaderButton'; 
import { useSelector, useDispatch} from 'react-redux';
import * as productsActions from '../../store/actions/productsAction';
import { Formik, ErrorMessage  } from 'formik'
import * as Yup from 'yup';
import Colors from '../../constants/Color';

const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === prodId 
    ) );


    const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [imageUrl, setImageUrl] = useState(editedProduct? editedProduct.imageUrl : '');
    const [price, setPrice] = useState(editedProduct ? editedProduct.price : '');
    const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const dispatch = useDispatch(); 

    const productFormSchema = Yup.object({
        title: Yup.string()
        .trim()
        .required() 
        .min(3, "title must be 3 characters at minimum"),
    
        imageUrl: Yup.string()
        .trim()
        .required() 
        .min(3, "imageUrl must be 3 characters at minimum"),
    
        price: Yup.number()
        .required("price is required")
        .typeError('Price must be a number')
        .positive('age must be greater than zero'),
    
        description: Yup.string()
        .trim()
        .required('description is required !')
        .min(4, "description must be 4 characters at minimum"),
    
       
    }) 
    

    const submitHandler = useCallback( async (values, actions) => {
        console.log(values.description);
        setError(null);
        setIsLoading(true);
        try { 

        if(editedProduct) {
            await dispatch(productsActions.updateProduct(prodId, values.title, values.description, values.imageUrl, +values.price));
        }else{
            await dispatch(productsActions.createProduct(values.title, values.description, values.imageUrl, +values.price)); 
        }
         
        props.navigation.goBack(); 
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false); 

    }, [dispatch, prodId, title, imageUrl, price, description]);


    // useEffect(() => {
    //     props.navigation.setParams({'submit': submitHandler});
    // }, [submitHandler]);
    
    if(error){
        Alert.alert('An error occured !', error, [ {text: 'Okay'}]  );
        // return <View style={styles.centered}>
        //    <Text> {error} </Text>
        //    <Button title='Back' onPress={() => props.navigation.goBack()} color={Colors.primary} />
        // </View>
    }

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}  />
        </View>
    }



    return (
        <Formik
            initialValues={{
                title: editedProduct ? editedProduct.title : '',
                imageUrl: editedProduct? editedProduct.imageUrl : '',
                price: editedProduct? editedProduct.price : '', 
                description: editedProduct? editedProduct.description : ''
            }}
            onSubmit={(values, actions) => { submitHandler(values, actions)}}
            validationSchema={productFormSchema}
            validateOnChange={true}
        >
            { ({ handleChange, handleSubmit, handleBlur, values, errors, isValid, touched, dirty }) => 
           {
            useEffect(() => {
                console.log('FIRST LOADING !!!')
                props.navigation.setParams({'submit': handleSubmit});
                props.navigation.setParams({'isValid': !(dirty && isValid)});
            }, [handleSubmit, touched, dirty]); 
            
            return ( <KeyboardAvoidingView 
            style={{flex: 1}} 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            >
         <TouchableWithoutFeedback > 
        <View style={styles.form}>
            <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput  
                style={styles.input} 
                // value={title}  
                value={values.title}  
                // onChangeText={text => setTitle(text)}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                touched={touched.title}
                keyboardType='default'
                autoCapitalize='sentences'
                autoCorrect
                error={errors.title}
                returnKeyType='next'
                onEndEditing={() => { console.log('onEndEditing')}}
                onSubmitEditing={() => { console.log('onSubmitEditing')}}
                name="title"
                placeholder="Title"
                />
            </View>
            {errors.title && <Text style={{color: Colors.primary, fontFamily: 'open-sans-bold'}}><ErrorMessage name="title" /></Text> }
            <View style={styles.formControl}>
                <Text style={styles.label}>Image URL</Text>
                <TextInput style={styles.input}
                // value={imageUrl}  
                value={values.imageUrl}  
                // onChangeText={text => setImageUrl(text)}
                onChangeText={handleChange('imageUrl')}
                onBlur={handleBlur('imageUrl')}
                touched={touched.imageUrl}
                name="imageUrl"
                error={errors.imageUrl}
                placeholder="Image Url"
                 />
            </View>
            {errors.imageUrl && <Text style={{color: Colors.primary, fontFamily: 'open-sans-bold'}}><ErrorMessage name="imageUrl" /></Text> }
            
            {/* {editedProduct ? null :  */}
                 <View style={styles.formControl}>
                <Text style={styles.label}>Price</Text>
                <TextInput style={styles.input} 
                // value={price}  
                value={values.price.toString()}  
                // onChangeText={text => setPrice(text)}
                onChangeText={handleChange('price')}
                onBlur={handleBlur('price')}
                touched={touched.price}
                keyboardType='decimal-pad'
                // keyboardType={'numeric'} 
                name="price"
                error={errors.price}
                placeholder="Price"
                />
            </View> 
            {/* } */}
            {errors.price && <Text style={{color: Colors.primary, fontFamily: 'open-sans-bold'}}><ErrorMessage name="price" /></Text> }
            <View style={styles.formControl}>
                <Text style={styles.label}>Description</Text>
                <TextInput style={styles.input}
                // value={description}  
                value={values.description}  
                // onChangeText={text => setDescription(text)}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                touched={touched.description}
                name="description"
                error={errors.description}
                placeholder="Description"
                multiline
                numberOfLines={3}
                 />
            </View>
            {errors.description && <Text style={{color: Colors.primary, fontFamily: 'open-sans-bold'}}><ErrorMessage name="description" /></Text> }
            <Button onPress={handleSubmit} disabled={!(dirty && isValid)} title="Submit" />
        </View> 
    </TouchableWithoutFeedback >
    </KeyboardAvoidingView>
    )
            }}
      </Formik>
    )
}

const headerRightButton = (navData) => {
    const submitFn = navData.navigation.getParam('submit');  
    return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item 
            title='Save'  
            iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}  
            onPress={submitFn} 
            />
        </HeaderButtons>
    )
}

 
 


EditProductScreen.navigationOptions = navData => { 
    const isValid = navData.navigation.getParam('isValid');
   
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Product' : 'Add Product',
        headerRight:  (() => headerRightButton(navData)) 
    }
}

const styles =  StyleSheet.create({
    form: {
        margin: 20
    },
    formControl: {
        width: '100%',
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;