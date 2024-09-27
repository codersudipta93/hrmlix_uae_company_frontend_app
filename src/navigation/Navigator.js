import React from 'react';

//Navigation Import
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import {
  Splash,
  Signin,
  EployeeAttendanceView,
  FilterEmployeePage,
  EployeeAttendanceDetails,
  RegularizeShift,
  EditMonthlyAttendanceDetails,
  AttendanceSummary,
  AttendanceSummaryFilter,
  AttendanceListingConsole,
  EmplyeeAttendance,
  DocumentVault,
  BillingList,
  BillingMaster,
  PurchaseHistory,
  ConsumptionHistory,
  GovtRule,
  CompanyProfileDashboard,
  ProfileAndPartnerdetails,
  EstablishmentDetails,
  RegisteredOfficeAddress,
  CommunicationAddress,
  PrefferanceSettings,
  CompanyBranch,
  AnnouncementList,
  AnnouncementEdit,
  AnnouncementDetails,
  AnnouncementListSearch,
  SallaryRevisionDashboard,
  ApplyRevision,
  ApplyRevisionFilter,
  CalculatedRevision,
  CalculatedRevisionFilter,
  RevisionReport,
  ArrearSlip,
  RevisionReportFilter,
  EmployeeDashboard,
  EmployeeAddress,
  EmployeeBankDetails,
  EmployeeHrDetails,
  EmployeePersonalDetails,
  OtherInfoDashboard,
  ShortcutsDashboard,
  TrainingDetails,
  DiscipilinaryAction,
  AccidentDetails,
  ExtraCurricular,
  EducationDetails,
  EmployeeAssets,
  ContractDetails,
  AnnualComponent,
  KPIPerformance,
  Fnf,
  FnfReport,
  EmployeeFilter
} from '../screens';

import TabNavigator from './TabNavigator'
function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{
          headerShown: false,
          // presentation: 'modal',
          animationTypeForReplace: 'push',
          animation: 'simple_push'
        }} />

        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="EployeeAttendanceView" component={EployeeAttendanceView} />
        <Stack.Screen name="FilterEmployeePage" component={FilterEmployeePage} />
        <Stack.Screen name="EployeeAttendanceDetails" component={EployeeAttendanceDetails} />
        <Stack.Screen name="RegularizeShift" component={RegularizeShift} />
        <Stack.Screen name="EditMonthlyAttendanceDetails" component={EditMonthlyAttendanceDetails} />
        <Stack.Screen name="AttendanceSummary" component={AttendanceSummary} />
        <Stack.Screen name="AttendanceSummaryFilter" component={AttendanceSummaryFilter} />
        <Stack.Screen name="AttendanceListingConsole" component={AttendanceListingConsole} />
        <Stack.Screen name="EmplyeeAttendance" component={EmplyeeAttendance} />
        <Stack.Screen name="DocumentVault" component={DocumentVault} />
        <Stack.Screen name="BillingList" component={BillingList} />
        <Stack.Screen name="BillingMaster" component={BillingMaster} />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
        <Stack.Screen name="ConsumptionHistory" component={ConsumptionHistory} />
        <Stack.Screen name="GovtRule" component={GovtRule} />
        <Stack.Screen name="CompanyProfileDashboard" component={CompanyProfileDashboard} />
        <Stack.Screen name="ProfileAndPartnerdetails" component={ProfileAndPartnerdetails} />
        <Stack.Screen name="EstablishmentDetails" component={EstablishmentDetails} />
        <Stack.Screen name="RegisteredOfficeAddress" component={RegisteredOfficeAddress} />
        <Stack.Screen name="CommunicationAddress" component={CommunicationAddress} />
        <Stack.Screen name="PrefferanceSettings" component={PrefferanceSettings} />
        <Stack.Screen name="CompanyBranch" component={CompanyBranch} />
        <Stack.Screen name="AnnouncementList" component={AnnouncementList} />
        <Stack.Screen name="AnnouncementEdit" component={AnnouncementEdit} />
        <Stack.Screen name="AnnouncementDetails" component={AnnouncementDetails} />
        <Stack.Screen name="AnnouncementListSearch" component={AnnouncementListSearch} />
        <Stack.Screen name="SallaryRevisionDashboard" component={SallaryRevisionDashboard} />
        <Stack.Screen name="ApplyRevision" component={ApplyRevision} />
        <Stack.Screen name="ApplyRevisionFilter" component={ApplyRevisionFilter} />
        <Stack.Screen name="CalculatedRevision" component={CalculatedRevision} />
        <Stack.Screen name="CalculatedRevisionFilter" component={CalculatedRevisionFilter} />
        <Stack.Screen name="RevisionReport" component={RevisionReport} />
        <Stack.Screen name="ArrearSlip" component={ArrearSlip} />
        <Stack.Screen name="RevisionReportFilter" component={RevisionReportFilter} />
        <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />
        <Stack.Screen name="EmployeeAddress" component={EmployeeAddress} />
        <Stack.Screen name="EmployeeBankDetails" component={EmployeeBankDetails} />
        <Stack.Screen name="EmployeeHrDetails" component={EmployeeHrDetails} />
        <Stack.Screen name="EmployeePersonalDetails" component={EmployeePersonalDetails} />
        <Stack.Screen name="OtherInfoDashboard" component={OtherInfoDashboard} />
        <Stack.Screen name="ShortcutsDashboard" component={ShortcutsDashboard} />
        <Stack.Screen name="TrainingDetails" component={TrainingDetails} />
        <Stack.Screen name="DiscipilinaryAction" component={DiscipilinaryAction} />
        <Stack.Screen name="AccidentDetails" component={AccidentDetails} />
        <Stack.Screen name="EducationDetails" component={EducationDetails} />
        <Stack.Screen name="ExtraCurricular" component={ExtraCurricular} />
        <Stack.Screen name="EmployeeAssets" component={EmployeeAssets} />
        <Stack.Screen name="ContractDetails" component={ContractDetails} />
        <Stack.Screen name="AnnualComponent" component={AnnualComponent} />
        <Stack.Screen name="KPIPerformance" component={KPIPerformance} />
        <Stack.Screen name="Fnf" component={Fnf} />
        <Stack.Screen name="FnfReport" component={FnfReport} />
        <Stack.Screen name="EmployeeFilter" component={EmployeeFilter} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

