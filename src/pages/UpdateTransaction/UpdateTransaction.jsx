import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './UpdateTransaction.css';

const pumpHeads = [
    '01',
    '02',
    '03',
    '04',
    '05',
    // ...
];

const validationSchema = Yup.object().shape({
    transactionTime: Yup.date().required('Transaction time is required'),
    amount: Yup.number().positive('Amount must be a positive number').required('Amount is required'),
    pumpHead: Yup.string().required('Pump head is required'),
    income: Yup.number().positive('Income must be a positive number').required('Income is required'),
    unitPrice: Yup.number().positive('Unit price must be a positive number').required('Unit price is required'),
});

function UpdateTransaction() {
    const handleSubmit = (values, { resetForm }) => {
        alert('Transaction updated successfully!');
        console.log('Submitted Values:', values);
        resetForm(); 
    };

    return (
        <div className="home-page">
            <nav className="header">
                <div className="header-content">
                    <a className="app_name" href="/">TM App</a>
                    <ul className="header-action">
                        <li className="nav-item">
                            <a className="nav-link nav-link-active active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item action_active">
                            <a className="nav-link" href="/update-transaction">Update transaction</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/api-data">Task 4</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="home-page_content">
                <Formik
                    initialValues={{
                        transactionTime: null,
                        amount: '',
                        pumpHead: '',
                        income: '',
                        unitPrice: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form className="update-form">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <Field name="transactionTime">
                                        {({ field }) => (
                                            <DateTimePicker
                                                label="Transaction Time"
                                                value={field.value}
                                                onChange={(newValue) => setFieldValue('transactionTime', newValue)}
                                                renderInput={(params) => <TextField {...params} error={!!field.value && !field.value} helperText={<ErrorMessage name="transactionTime" />} />}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage name="transactionTime" className="error-message" component="div" style={{ color: '#ff0000' }} />
                                </div>
                            </LocalizationProvider>

                            <Field name="amount">
                                {({ field }) => (
                                    <TextField
                                        label="Amount"
                                        type="number"
                                        {...field}
                                        fullWidth
                                        error={!!field.value && isNaN(field.value)}
                                        helperText={<ErrorMessage name="amount" />}
                                    />
                                )}
                            </Field>

                            <Field name="pumpHead">
                                {({ field }) => (
                                    <TextField
                                        select
                                        label="Pump head"
                                        {...field}
                                        fullWidth
                                        error={!!field.value && !field.value}
                                        helperText={<ErrorMessage name="pumpHead" />}
                                    >
                                        {pumpHeads.map((pumpHead, index) => (
                                            <MenuItem key={index} value={pumpHead}>
                                                {pumpHead}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </Field>

                            <Field name="income">
                                {({ field }) => (
                                    <TextField
                                        label="Income"
                                        type="number"
                                        {...field}
                                        fullWidth
                                        error={!!field.value && isNaN(field.value)}
                                        helperText={<ErrorMessage name="income" />}
                                    />
                                )}
                            </Field>

                            <Field name="unitPrice">
                                {({ field }) => (
                                    <TextField
                                        label="Unit Price"
                                        type="number"
                                        {...field}
                                        fullWidth
                                        error={!!field.value && isNaN(field.value)}
                                        helperText={<ErrorMessage name="unitPrice" />}
                                    />
                                )}
                            </Field>

                            <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>
                                Update
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default UpdateTransaction;
