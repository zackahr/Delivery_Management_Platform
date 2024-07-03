import React, { useState } from 'react';
import axios from 'axios';
import './AddCommand.css';
import { useTranslation } from 'react-i18next';

interface AddCommandProps {
    onAddCommand: (command: {
        commandOwner: string;
        userAddress: string;
        productName: string;
        productQuantity: number;
        productPrice: number;
        paidAmount?: number;
        createdAt?: Date;
    }) => void;
}

const AddCommand: React.FC<AddCommandProps> = ({ onAddCommand }) => {
    const { t } = useTranslation(); // Use the translation hook
    const [currentStep, setCurrentStep] = useState(1);
    const [commandOwner, setCommandOwner] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [productName, setProductName] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleAddCommand = async () => {
        if (validateStep(currentStep)) {
            try {
                const quantityNumber = parseInt(productQuantity);
                const priceNumber = parseFloat(productPrice);
                const paidAmountNumber = paidAmount ? parseFloat(paidAmount) : undefined;
    
                if (commandOwner && userAddress && productName && !isNaN(quantityNumber) && !isNaN(priceNumber)) {
                    const newCommand = {
                        commandOwner,
                        userAddress,
                        productName,
                        productQuantity: quantityNumber,
                        productPrice: priceNumber,
                        paidAmount: paidAmountNumber,
                        createdAt: createdAt || new Date(),
                    };
    
                    const response = await axios.post('http://localhost:3000/commands/', newCommand);
                    console.log('Command added successfully!', response.data);
                    onAddCommand(newCommand);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2000);
                } else {
                    alert('Please enter valid values for all fields');
                }
            } catch (error) {
                console.error('Error adding command:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                }
                alert('Failed to add command. Please try again.');
            }
        }
    };
    

    const validateStep = (step: number) => {
        let valid = true;
        const newErrors: { [key: string]: string } = {};

        switch (step) {
            case 1:
                if (!commandOwner) {
                    newErrors.commandOwner = t('Command owner is required'); // Translate error message
                    valid = false;
                }
                break;
            case 2:
                if (!userAddress) {
                    newErrors.userAddress = t('User address is required'); // Translate error message
                    valid = false;
                }
                break;
            case 3:
                if (!productName) {
                    newErrors.productName = t('Product name is required'); // Translate error message
                    valid = false;
                }
                break;
            case 4:
                if (!productQuantity || isNaN(parseInt(productQuantity))) {
                    newErrors.productQuantity = t('Valid quantity is required'); // Translate error message
                    valid = false;
                }
                break;
            case 5:
                if (!productPrice || isNaN(parseFloat(productPrice))) {
                    newErrors.productPrice = t('Valid price is required'); // Translate error message
                    valid = false;
                }
                break;
            case 6:
                if (paidAmount && isNaN(parseFloat(paidAmount))) {
                    newErrors.paidAmount = t('Valid paid amount is required'); // Translate error message
                    valid = false;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return valid;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-group">
                        <label htmlFor="commandOwner">{t('Command Owner')}</label> {/* Translate label */}
                        <input
                            type="text"
                            id="commandOwner"
                            value={commandOwner}
                            onChange={(e) => setCommandOwner(e.target.value)}
                        />
                        {errors.commandOwner && <span className="error">{errors.commandOwner}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!commandOwner}>{t('Next')}</button> {/* Translate button */}
                    </div>
                );
            case 2:
                return (
                    <div className="form-group">
                        <label htmlFor="userAddress">{t('Client Address')}</label> {/* Translate label */}
                        <input
                            type="text"
                            id="userAddress"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                        />
                        {errors.userAddress && <span className="error">{errors.userAddress}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!userAddress}>{t('Next')}</button> {/* Translate button */}
                    </div>
                );
            case 3:
                return (
                    <div className="form-group">
                        <label htmlFor="productName">{t('Product Name')}</label> {/* Translate label */}
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        {errors.productName && <span className="error">{errors.productName}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!productName}>{t('Next')}</button> {/* Translate button */}
                    </div>
                );
            case 4:
                return (
                    <div className="form-group">
                        <label htmlFor="productQuantity">{t('Quantity')}</label> {/* Translate label */}
                        <input
                            type="text"
                            id="productQuantity"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                        />
                        {errors.productQuantity && <span className="error">{errors.productQuantity}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!productQuantity || isNaN(parseInt(productQuantity))}>{t('Next')}</button>
                    </div>
                );
            case 5:
                return (
                    <div className="form-group">
                        <label htmlFor="productPrice">{t('Price per Unit')}</label> {/* Translate label */}
                        <input
                            type="text"
                            id="productPrice"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                        {errors.productPrice && <span className="error">{errors.productPrice}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!productPrice || isNaN(parseFloat(productPrice))}>{t('Next')}</button> {/* Translate button */}
                    </div>
                );
            case 6:
                return (
                    <div className="form-group">
                        <label htmlFor="paidAmount">{t('Paid Amount')}</label> {/* Translate label */}
                        <input
                            type="text"
                            id="paidAmount"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                        />
                        {errors.paidAmount && <span className="error">{errors.paidAmount}</span>}
                        <button className="add-button" onClick={handleAddCommand} disabled={!paidAmount || isNaN(parseFloat(paidAmount))}>{t('Add Command')}</button> {/* Translate button */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="add-command">
            <h2>{t('Create New Command')}</h2> {/* Translate heading */}
            {renderStepContent()}
            {currentStep > 1 && (
                <button className="back-button" onClick={() => setCurrentStep(currentStep - 1)}>{t('Back')}</button>
            )}
            {showSuccess && <div className="success-message">{t('Command added successfully!')}</div>} {/* Translate success message */}
        </div>
    );
};

export default AddCommand;
