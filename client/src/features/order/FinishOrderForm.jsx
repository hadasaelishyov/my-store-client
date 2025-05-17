// FinishOrderForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { 
  selectCart, 
  selectCartTotal, 
  updateOrderDetails,
  createOrderFromCart 
} from '../order/orderSlice';
import { selectCurrentUser } from '../user/userSlice';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { format, addDays } from 'date-fns';

const steps = ['Shipping Details', 'Delivery Options', 'Review Order'];

const FinishOrderForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCart);
  const cartTotal = useAppSelector(selectCartTotal);
  const currentUser = useAppSelector(selectCurrentUser);
  
  // If no items in cart, redirect to cart page
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/summary');
    }
  }, [cartItems, navigate]);

  // If not logged in, redirect to login page
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/finish-order' } });
    }
  }, [currentUser, navigate]);

  const [activeStep, setActiveStep] = useState(0);
  const [formError, setFormError] = useState('');
  
  // Form values
  const [shippingDetails, setShippingDetails] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Israel',
    notes: ''
  });
  
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const today = new Date();
  const standardDeliveryDate = addDays(today, 5);
  const expressDeliveryDate = addDays(today, 2);
  
  const handleShippingInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value
    });
  };
  
  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };
  
  const validateShippingDetails = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'];
    
    for (const field of requiredFields) {
      if (!shippingDetails[field]) {
        setFormError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingDetails.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    
    const phoneRegex = /^\d{9,10}$/;
    if (!phoneRegex.test(shippingDetails.phone)) {
      setFormError('Please enter a valid phone number (9-10 digits)');
      return false;
    }
    
    setFormError('');
    return true;
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateShippingDetails()) {
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmitOrder = async () => {
    try {
      // Update order details in redux state
      const deliveryDate = deliveryOption === 'express' ? expressDeliveryDate : standardDeliveryDate;
      
      dispatch(updateOrderDetails({
        orderDate: format(today, 'yyyy-MM-dd'),
        deliveryDate: format(deliveryDate, 'yyyy-MM-dd'),
        shippingAddress: shippingDetails.address,
        shippingCity: shippingDetails.city,
        shippingZipCode: shippingDetails.zipCode,
        shippingCountry: shippingDetails.country
      }));
      
      // Create order from cart through async thunk
      await dispatch(createOrderFromCart({
        firstName: shippingDetails.firstName,
        lastName: shippingDetails.lastName,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        zipCode: shippingDetails.zipCode,
        country: shippingDetails.country,
        deliveryOption,
        notes: shippingDetails.notes
      })).unwrap();
      
      // Navigate to payment page
      navigate('/payment');
    } catch (error) {
      setFormError(error.toString());
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Shipping Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="First Name"
                name="firstName"
                value={shippingDetails.firstName}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Last Name"
                name="lastName"
                value={shippingDetails.lastName}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Email Address"
                name="email"
                type="email"
                value={shippingDetails.email}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Phone Number"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="tel"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Address"
                name="address"
                value={shippingDetails.address}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="shipping address-line1"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="City"
                name="city"
                value={shippingDetails.city}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="shipping address-level2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Zip / Postal code"
                name="zipCode"
                value={shippingDetails.zipCode}
                onChange={handleShippingInputChange}
                fullWidth
                autoComplete="shipping postal-code"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                name="notes"
                value={shippingDetails.notes}
                onChange={handleShippingInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        );
      case 1: // Delivery Options
        return (
          <Box>
            <FormControl component="fieldset">
              <FormLabel component="legend">Delivery Options</FormLabel>
              <RadioGroup
                aria-label="delivery-option"
                name="delivery-option"
                value={deliveryOption}
                onChange={handleDeliveryOptionChange}
              >
                <Paper sx={{ p: 2, mb: 2, border: deliveryOption === 'standard' ? '2px solid #1976d2' : 'none' }}>
                  <FormControlLabel 
                    value="standard" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">Standard Delivery</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Estimated delivery: {format(standardDeliveryDate, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Free
                        </Typography>
                      </Box>
                    } 
                  />
                </Paper>
                <Paper sx={{ p: 2, border: deliveryOption === 'express' ? '2px solid #1976d2' : 'none' }}>
                  <FormControlLabel 
                    value="express" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="subtitle1">Express Delivery</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Estimated delivery: {format(expressDeliveryDate, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          $15.00
                        </Typography>
                      </Box>
                    } 
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2: // Review Order
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Shipping</Typography>
                <Typography variant="body2">
                  {shippingDetails.firstName} {shippingDetails.lastName}
                </Typography>
                <Typography variant="body2">{shippingDetails.address}</Typography>
                <Typography variant="body2">
                  {shippingDetails.city}, {shippingDetails.zipCode}
                </Typography>
                <Typography variant="body2">{shippingDetails.country}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Delivery Details</Typography>
                <Typography variant="body2">
                  Method: {deliveryOption === 'express' ? 'Express' : 'Standard'} Delivery
                </Typography>
                <Typography variant="body2">
                  Expected delivery: {format(
                    deliveryOption === 'express' ? expressDeliveryDate : standardDeliveryDate,
                    'MMMM d, yyyy'
                  )}
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Items
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">
                  {item.product.name} × {item.quantity}
                </Typography>
                <Typography variant="body1">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="subtitle1">${cartTotal.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">Shipping</Typography>
              <Typography variant="subtitle1">
                {deliveryOption === 'express' ? '$15.00' : 'Free'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                ${(cartTotal + (deliveryOption === 'express' ? 15 : 0)).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };
  
  if (cartItems.length === 0 || !currentUser) {
    return null; // Will be redirected by useEffect
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
          </Alert>
        )}
        
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitOrder}
            >
              Place Order
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FinishOrderForm;