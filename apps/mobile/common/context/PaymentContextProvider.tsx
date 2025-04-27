import {Platform, StyleSheet} from 'react-native'
import {createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState} from "react";
import Purchases, {CustomerInfo, LOG_LEVEL, LogInResult, PurchasesOffering, PurchasesPackage} from "react-native-purchases";
import {CONFIG} from "@/common/constants";
import {WithChildren} from "@/common/types/common";
import _ from 'lodash';

interface PaymentContextProviderProps extends WithChildren {
    premiumMember: boolean
    setCustomer:Dispatch<SetStateAction<CustomerInfo | null>>
    customer: CustomerInfo | null
    packages: Array<PurchasesPackage>
    currentOffering: PurchasesOffering | null
    logInWithRevenueCat: (appUserID: string) => Promise<LogInResult>;
    logOutFromRevenueCat: () => Promise<CustomerInfo>;
    getManagementURL: () => Promise<string | null>
    getSubscriptionStatus: () => Promise<'active' | 'expired' | 'inactive'>
    getExpirationDate: () => Promise<Date | null>
    setEmail(email: string | null): Promise<void>
    setDisplayName(displayName: string | null): Promise<void>
}

const PaymentContext = createContext<Omit<PaymentContextProviderProps, "children"> | undefined>(undefined)

const PaymentContextProvider = ({children}: WithChildren) => {

    const [customer, setCustomer] = useState<CustomerInfo | null>(null)
    const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
    const [packages, setPackages] = useState<Array<PurchasesPackage>>([])
    const [premiumMember, setPremiumMember] = useState<boolean>(false);

    const styles = useMemo(() => {
        return StyleSheet.create({
            wrapper: {

            },
        })
    }, []);

    const customerInfoListener = useCallback((info: CustomerInfo) => {
        setCustomer(info);
    }, [])

    const loadOfferings = useCallback(async () => {
        try {
            const offerings = await Purchases.getOfferings();

            if (offerings.current) {
                setCurrentOffering(offerings.current);
                setPackages(offerings.current.availablePackages);
            } else {
                console.warn('No current offering found');
            }
        } catch (error) {
            console.error('Error loading offerings:', error);
        }
    }, [])

    const updateCustomerInfo = useCallback(async () => {
        try {
            const info = await Purchases.getCustomerInfo();
            setCustomer(info);
        } catch (error) {
            console.error('Error updating customer info:', error);
        }
    }, [])

    const purchasePackage = useCallback(async (pack: PurchasesPackage) => {
        try {
            const data = await Purchases.purchasePackage(pack);
            setCustomer(data.customerInfo);
            return data;
        } catch (error: any) {
           throw error
        }
    }, [])

    const setDisplayName = useCallback(async (displayName: string | null) => {
        try {
            await Purchases.setDisplayName(displayName);
        } catch (error) {
            console.error('Error setting display name:', error);
            throw error;
        }
    }, [])

    const setEmail = useCallback(async (email: string | null) => {
        try {
            await Purchases.setEmail(email);
        } catch (error) {
            console.error('Error setting email:', error);
            throw error;
        }
    }, [])

    const getManagementURL = useCallback(async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const managementURL = customerInfo.managementURL;
            if (managementURL) {
                return managementURL;
            } else {
                console.log("No management URL available.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching customer info:", error);
            return null;
        }
    }, [])

    const restorePurchases = useCallback(async () => {
        try {
            const restoredInfo = await Purchases.restorePurchases();
            setCustomer(restoredInfo);

            const hasActiveSubscription = restoredInfo.entitlements.active['pro_access'] !== undefined;
            setPremiumMember(hasActiveSubscription);

            return {
                success: true,
                hasSubscription: hasActiveSubscription,
            };
        } catch (error) {
            console.error('Error restoring purchases:', error);
            return {
                success: false,
                hasSubscription: false,
            };
        }
    }, [])

    const getSubscriptionStatus = useCallback(async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const entitlements = _.values(customerInfo.entitlements.active)

            if(entitlements.length === 0) return "inactive"
            if(!entitlements[0].willRenew) return "expired"
            return "active"
        } catch (error) {
            console.error('Error fetching subscription status:', error);
            return 'inactive';
        }
    }, []);

    const getExpirationDate = useCallback(async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const entitlement = customerInfo.entitlements.active['pro_access'];
            if (entitlement && entitlement.isActive && !entitlement.willRenew) {
                return new Date(entitlement.expirationDate as string);
            }
            return null;
        } catch (error) {
            console.error('Error fetching expiration date:', error);
            return null;
        }
    }, []);

    const logInWithRevenueCat = useCallback(async (appUserID: string) => {
        return await Purchases.logIn(appUserID);
    }, [])

    const logOutFromRevenueCat = useCallback(async () => {
        return await Purchases.logOut();
    }, [])

    const initialize = useCallback(async () => {
        const apiKey = Platform.select({
            ios: process.env['EXPO_PUBLIC_REVENUECAT_IOS'],
            android: process.env['EXPO_PUBLIC_REVENUECAT_ANDROID'],
            default: '',
        });

        if (!apiKey) {
            console.warn(`RevenueCat API key missing for platform: ${Platform.OS}`);
            return;
        }

        Purchases.configure({
            apiKey,
        });

        if (CONFIG.IS_DEVELOPMENT) {
            await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        Purchases.addCustomerInfoUpdateListener(customerInfoListener);

        await Promise.all([loadOfferings(), updateCustomerInfo()]);
    }, [])

    useEffect(() => {
        initialize()

        return () => {
            Purchases.removeCustomerInfoUpdateListener(customerInfoListener)
        }
    }, [])

    useEffect(() => {
        if (customer) {
            setPremiumMember(customer.entitlements.active['Premium'] !== undefined);
        }
    }, [customer]);

    const value = {
        packages,
        customer,
        setEmail,
        setCustomer,
        setDisplayName,
        currentOffering,
        premiumMember,
        getManagementURL,
        logInWithRevenueCat,
        logOutFromRevenueCat,
        getExpirationDate,
        getSubscriptionStatus
    }

    return(
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    )
}

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePaymentContext must be used within a PaymentContextProvider');
    }
    return context;
}

export default PaymentContextProvider