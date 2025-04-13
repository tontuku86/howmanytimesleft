'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n/client';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';
import { enUS } from 'date-fns/locale/en-US';
import { zhCN } from 'date-fns/locale/zh-CN';
import "react-datepicker/dist/react-datepicker.css";

// 言語をDatepickerに登録
registerLocale('ja', ja);
registerLocale('en', enUS);
registerLocale('zh', zhCN);

type FrequencyType = 'times-per-day' | 'times-per-week' | 'times-per-month' | 'times-per-year';
type AgeInputType = 'manual' | 'birthdate';

export default function Calculator({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const { t } = useTranslation('common', { lng: locale });
  
  const [ageInputType, setAgeInputType] = useState<AgeInputType>('manual');
  const [currentAge, setCurrentAge] = useState<number | ''>('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [expectedLifespan, setExpectedLifespan] = useState<number | ''>('');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('times-per-day');
  const [frequencyValue, setFrequencyValue] = useState<number | ''>(1);
  const [result, setResult] = useState<number | null>(null);
  const [totalPossible, setTotalPossible] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);

  // 言語に合わせてDatepickerの言語も設定
  useEffect(() => {
    setDefaultLocale(locale.substring(0, 2));
  }, [locale]);

  // 生年月日から年齢を計算
  useEffect(() => {
    if (birthdate) {
      const today = new Date();
      const birth = birthdate;
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setCurrentAge(age);
    }
  }, [birthdate]);

  const handleCalculate = () => {
    if (
      currentAge === '' || 
      expectedLifespan === '' || 
      frequencyValue === '' ||
      typeof currentAge !== 'number' ||
      typeof expectedLifespan !== 'number' ||
      typeof frequencyValue !== 'number'
    ) {
      return;
    }

    const yearsLeft = expectedLifespan - currentAge;
    
    if (yearsLeft <= 0) {
      setResult(0);
      setPercentage(0);
      setTotalPossible(0);
      return;
    }

    let timesLeft = 0;
    let totalPossibleTimes = 0;
    const daysInYear = 365.25;
    
    switch (frequencyType) {
      case 'times-per-day':
        timesLeft = Math.round(yearsLeft * daysInYear * frequencyValue);
        totalPossibleTimes = Math.round(expectedLifespan * daysInYear * frequencyValue);
        break;
      case 'times-per-week':
        timesLeft = Math.round(yearsLeft * 52 * frequencyValue);
        totalPossibleTimes = Math.round(expectedLifespan * 52 * frequencyValue);
        break;
      case 'times-per-month':
        timesLeft = Math.round(yearsLeft * 12 * frequencyValue);
        totalPossibleTimes = Math.round(expectedLifespan * 12 * frequencyValue);
        break;
      case 'times-per-year':
        timesLeft = Math.round(yearsLeft * frequencyValue);
        totalPossibleTimes = Math.round(expectedLifespan * frequencyValue);
        break;
    }
    
    setResult(timesLeft);
    setTotalPossible(totalPossibleTimes);
    setPercentage(Math.round((timesLeft / totalPossibleTimes) * 100));
  };

  // DatePickerのカスタマイズ
  const getLocale = () => {
    const currentLocale = locale.substring(0, 2);
    return currentLocale === 'ja' ? ja : currentLocale === 'zh' ? zhCN : enUS;
  };

  const handleDateChange = (date: Date | null) => {
    setBirthdate(date);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 text-center dark:text-white">{t('subtitle')}</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('ageInputMethod')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="manual-age"
                checked={ageInputType === 'manual'}
                onChange={() => setAgeInputType('manual')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="manual-age" className="text-sm text-gray-700 dark:text-gray-300">
                {t('manualAge')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="birthdate-age"
                checked={ageInputType === 'birthdate'}
                onChange={() => setAgeInputType('birthdate')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="birthdate-age" className="text-sm text-gray-700 dark:text-gray-300">
                {t('birthdate')}
              </label>
            </div>
          </div>

          {ageInputType === 'manual' ? (
            <div>
              <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('currentAge')}
              </label>
              <input
                type="number"
                id="currentAge"
                min="0"
                max="150"
                value={currentAge}
                onChange={(e) => setCurrentAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('birthdate')}
              </label>
              <div className="react-datepicker-wrapper w-full">
                <DatePicker 
                  selected={birthdate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  locale={getLocale()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  placeholderText={t('selectDate')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700"
                />
              </div>
              {currentAge !== '' && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('calculatedAge')}: {currentAge}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="expectedLifespan" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('expectedLifespan')}
          </label>
          <input
            type="number"
            id="expectedLifespan"
            min="0"
            max="150"
            value={expectedLifespan}
            onChange={(e) => setExpectedLifespan(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('frequency')}
          </label>
          <div className="flex items-center space-x-4">
            <select
              value={frequencyType}
              onChange={(e) => setFrequencyType(e.target.value as FrequencyType)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="times-per-day">{t('timesPerDay')}</option>
              <option value="times-per-week">{t('timesPerWeek')}</option>
              <option value="times-per-month">{t('timesPerMonth')}</option>
              <option value="times-per-year">{t('timesPerYear')}</option>
            </select>
            
            <input
              type="number"
              min="1"
              max="100"
              value={frequencyValue}
              onChange={(e) => setFrequencyValue(e.target.value ? Number(e.target.value) : '')}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <span className="text-gray-700 dark:text-gray-300">{t('times')}</span>
          </div>
        </div>
        
        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mt-4"
        >
          {t('calculate')}
        </button>
      </div>
      
      {result !== null && (
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-md">
          <p className="text-center text-lg font-medium text-indigo-800 dark:text-indigo-100 mb-3">
            {t('result', { count: result })}
          </p>
          
          {percentage !== null && (
            <div className="mt-3">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-indigo-700 dark:text-indigo-200">{t('progressLabel')}</span>
                <span className="text-indigo-700 dark:text-indigo-200">{100 - percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${100 - percentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('totalPossible', { total: totalPossible })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 