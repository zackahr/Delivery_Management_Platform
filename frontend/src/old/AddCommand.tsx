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

const ip = import.meta.env.VITE_IP_ADDRESS;

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

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleAddCommand = async () => {
        if (validateStep(currentStep)) {
            try {
                const quantityNumber = parseInt(productQuantity, 10);
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

                    await axios.post(`https://${ip}/api/commands/`, newCommand);

                    resetForm();
                    onAddCommand(newCommand);
                } else {
                    alert(t('Please enter valid values for all fields'));
                }
            } catch (error) {
                console.error('Response data:', error);
            }
        }
    };

    const validateStep = (step: number) => {
        let valid = true;
        const newErrors: { [key: string]: string } = {};

        switch (step) {
            case 1:
                if (!commandOwner) {
                    newErrors.commandOwner = t('Command owner is required');
                    valid = false;
                }
                break;
            case 2:
                if (!userAddress) {
                    newErrors.userAddress = t('User address is required');
                    valid = false;
                }
                break;
            case 3:
                if (!productName) {
                    newErrors.productName = t('Product name is required');
                    valid = false;
                }
                break;
            case 4:
                if (!productQuantity || isNaN(parseInt(productQuantity, 10))) {
                    newErrors.productQuantity = t('Valid quantity is required');
                    valid = false;
                }
                break;
            case 5:
                if (!productPrice || isNaN(parseFloat(productPrice))) {
                    newErrors.productPrice = t('Valid price is required');
                    valid = false;
                }
                break;
            case 6:
                if (paidAmount && isNaN(parseFloat(paidAmount))) {
                    newErrors.paidAmount = t('Valid paid amount is required');
                    valid = false;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return valid;
    };

    const resetForm = () => {
        setCommandOwner('');
        setUserAddress('');
        setProductName('');
        setProductQuantity('');
        setProductPrice('');
        setPaidAmount('');
        setCreatedAt(null);
        setCurrentStep(1);
        setErrors({});
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setProductQuantity(value);
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setProductPrice(value);
        }
    };

    const handlePaidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setPaidAmount(value);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-group">
                        <label htmlFor="commandOwner">{t('Command Owner')}</label>
                        <input
                            type="text"
                            id="commandOwner"
                            value={commandOwner}
                            onChange={(e) => setCommandOwner(e.target.value)}
                        />
                        {errors.commandOwner && <span className="error">{errors.commandOwner}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!commandOwner}>{t('Next')}</button>
                    </div>
                );
            case 2:
                return (
                    <div className="form-group">
                        <label htmlFor="userAddress">{t('Client Address')}</label>
                        <input
                            type="text"
                            id="userAddress"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.target.value)}
                        />
                        {errors.userAddress && <span className="error">{errors.userAddress}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!userAddress}>{t('Next')}</button>
                    </div>
                );
            case 3:
                return (
                    <div className="form-group">
                        <label htmlFor="productName">{t('Product Name')}</label>
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                        {errors.productName && <span className="error">{errors.productName}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!productName}>{t('Next')}</button>
                    </div>
                );
            case 4:
                return (
                    <div className="form-group">
                        <label htmlFor="productQuantity">{t('Quantity')}</label>
                        <input
                            type="text"
                            id="productQuantity"
                            value={productQuantity}
                            onChange={handleQuantityChange}
                        />
                        {errors.productQuantity && <span className="error">{errors.productQuantity}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!productQuantity || isNaN(parseInt(productQuantity, 10))}>{t('Next')}</button>
                    </div>
                );
            case 5:
                return (
                    <div className="form-group">
                        <label htmlFor="productPrice">{t('Price per Unit')}</label>
                        <input
                            type="text"
                            id="productPrice"
                            value={productPrice}
                            onChange={handlePriceChange}
                        />
                        {errors.productPrice && <span className="error">{errors.productPrice}</span>}
                        <button className="next-button" onClick={handleNext} disabled={!productPrice || isNaN(parseFloat(productPrice))}>{t('Next')}</button>
                    </div>
                );
            case 6:
                return (
                    <div className="form-group">
                        <label htmlFor="paidAmount">{t('Paid Amount')}</label>
                        <input
                            type="text"
                            id="paidAmount"
                            value={paidAmount}
                            onChange={handlePaidAmountChange}
                        />
                        {errors.paidAmount && <span className="error">{errors.paidAmount}</span>}
                        <button className="add-button" onClick={handleAddCommand}>{t('Add Command')}</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="add-command">
            <h2>{t('Create New Command')}</h2>
            {renderStepContent()}
            {currentStep > 1 && (
                <button className="back-button" onClick={() => setCurrentStep(currentStep - 1)}>{t('Back')}</button>
            )}
        </div>
    );
};

export default AddCommand;
