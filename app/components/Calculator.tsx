'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from '../i18n/client';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ja } from 'date-fns/locale/ja';
import { enUS } from 'date-fns/locale/en-US';
import { zhCN } from 'date-fns/locale/zh-CN';
import OgImage from './OgImage';
import "react-datepicker/dist/react-datepicker.css";

// 言語をDatepickerに登録
registerLocale('ja', ja);
registerLocale('en', enUS);
registerLocale('zh', zhCN);

type FrequencyType = 'times-per-day' | 'times-per-week' | 'times-per-month' | 'times-per-year';
type AgeInputType = 'manual' | 'birthdate';
type ActivityType = {
  id: string;
  name: string;
  startAge: number;
};

export default function Calculator({ locale }: { locale?: string }) {
  console.log('Calculator: Component rendering with locale', locale);
  
  const { t, i18n } = useTranslation('common');
  const [ageInputType, setAgeInputType] = useState<AgeInputType>('manual');
  const [currentAge, setCurrentAge] = useState<number | ''>('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [expectedLifespan, setExpectedLifespan] = useState<number | ''>('');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('times-per-day');
  const [frequencyValue, setFrequencyValue] = useState<number | ''>(1);
  const [result, setResult] = useState<number | null>(null);
  const [totalPossible, setTotalPossible] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([
    { id: 'coffee', name: t('activity_coffee'), startAge: 20 }
  ]);
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(
    { id: 'coffee', name: t('activity_coffee'), startAge: 20 }
  );
  const [customActivity, setCustomActivity] = useState<string>('');
  const [showAddActivity, setShowAddActivity] = useState<boolean>(false);
  const [ogImageUrl, setOgImageUrl] = useState<string>('');

  // アクティビティの定義
  const presetActivities = useMemo(() => [
    { id: 'coffee', name: t('activity_coffee'), startAge: 20 },
    { id: 'reading', name: t('activity_reading'), startAge: 10 },
    { id: 'movie', name: t('activity_movie'), startAge: 5 },
    { id: 'friends', name: t('activity_friends'), startAge: 5 },
    { id: 'parents', name: t('activity_parents'), startAge: 0 },
  ], [locale, t]);

  // 言語が指定されている場合は、それに合わせて設定
  useEffect(() => {
    if (locale) {
      console.log('Calculator: Setting language from prop to', locale);
      if (i18n.language !== locale) {
        i18next.changeLanguage(locale).then(() => {
          console.log('Calculator: Language changed to', locale);
          // アクティビティ名も更新
          setCurrentActivity(prev => {
            const preset = presetActivities.find(p => p.id === prev.id);
            if (preset) {
              return {
                ...prev,
                name: t(`activities.${prev.id}`) || prev.name
              };
            }
            return prev;
          });
        });
      }
    }
  }, [locale, i18n.language, presetActivities]);

  console.log('Calculator: Current state', {
    ageInputType,
    currentAge, 
    expectedLifespan,
    frequencyType,
    frequencyValue,
    result,
    totalPossible,
    percentage,
    currentActivity,
    activities,
    i18n: i18n.language
  });

  // アクティビティが変更されたときに翻訳を更新
  useEffect(() => {
    console.log('Calculator: Updating translations for activities when language changes');
    // 現在選択されているアクティビティの名前を更新
    setCurrentActivity(prev => ({
      ...prev,
      name: activities.find(a => a.id === prev.id)?.name || prev.name
    }));
    
    // アクティビティリスト内の名前も更新
    setActivities(prevActivities => {
      return prevActivities.map(activity => {
        const preset = presetActivities.find(p => p.id === activity.id);
        if (preset) {
          return {
            ...activity,
            name: t(`activity_${activity.id}`)
          };
        }
        return activity;
      });
    });
  }, [i18n.language, presetActivities]);

  // 言語に合わせてDatepickerの言語も設定
  useEffect(() => {
    const locale = i18n.language?.substring(0, 2) || 'ja';
    console.log('Calculator: Setting DatePicker locale to', locale);
    setDefaultLocale(locale);
  }, [i18n.language]);

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
      console.log('Calculator: Age calculated from birthdate:', age);
      setCurrentAge(age);
    }
  }, [birthdate]);

  // 初期アクティビティを設定
  useEffect(() => {
    if (!activities.length) {
      console.log('Calculator: Initializing with preset activities');
      setActivities(presetActivities);
      setCurrentActivity(presetActivities[0]);
    } else if (!currentActivity.id) {
      console.log('Calculator: Setting current activity from activities');
      setCurrentActivity(activities[0]);
    }
  }, [activities, currentActivity.id, presetActivities]);

  // 初期状態のアクティビティ（言語変更時に更新される）
  useEffect(() => {
    // 現在表示されている行動を保持するための配列
    const currentIds = activities.map(a => a.id);
    
    // 現在のアクティビティだけを更新（新しく全部追加しない）
    const updatedActivities = currentIds.map(id => {
      if (id === 'coffee') {
        return { id: 'coffee', name: t('activity_coffee'), startAge: 20 };
      } else if (id === 'reading') {
        return { id: 'reading', name: t('activity_reading'), startAge: 10 };
      } else if (id === 'movie') {
        return { id: 'movie', name: t('activity_movie'), startAge: 5 };
      } else if (id === 'friends') {
        return { id: 'friends', name: t('activity_friends'), startAge: 5 };
      } else if (id === 'parents') {
        return { id: 'parents', name: t('activity_parents'), startAge: 0 };
      } else if (id.startsWith('custom-')) {
        // カスタム行動はそのまま保持
        const existingActivity = activities.find(a => a.id === id);
        return existingActivity || { id, name: id.replace('custom-', ''), startAge: 0 };
      }
      // デフォルトはコーヒー
      return { id: 'coffee', name: t('activity_coffee'), startAge: 20 };
    });
    
    // 空の場合はデフォルトのコーヒーを追加
    if (updatedActivities.length === 0) {
      updatedActivities.push({ id: 'coffee', name: t('activity_coffee'), startAge: 20 });
    }
    
    console.log('Calculator: Updating activities with new translations when locale changes');
    setActivities(updatedActivities);
    
    // 現在のアクティビティが存在する場合は更新、存在しない場合は最初のアクティビティを選択
    const currentId = currentActivity?.id || 'coffee';
    const updatedActivity = updatedActivities.find(a => a.id === currentId) || updatedActivities[0];
    setCurrentActivity(updatedActivity);
    
  }, [i18n.language, t]);

  const handleCalculate = () => {
    console.log('Calculator: Calculate button clicked');
    
    if (
      currentAge === '' || 
      expectedLifespan === '' || 
      frequencyValue === '' ||
      typeof currentAge !== 'number' ||
      typeof expectedLifespan !== 'number' ||
      typeof frequencyValue !== 'number'
    ) {
      console.log('Calculator: Invalid input values, calculation aborted');
      return;
    }

    // 現在のアクティビティの開始年齢を考慮
    const effectiveAge = Math.max(currentAge, currentActivity.startAge);
    const yearsLeft = expectedLifespan - effectiveAge;
    const yearsPassed = Math.max(0, effectiveAge - currentActivity.startAge);
    
    console.log('Calculator: Calculation parameters', {
      currentAge,
      expectedLifespan,
      startAge: currentActivity.startAge,
      effectiveAge,
      yearsLeft,
      yearsPassed,
      frequencyType,
      frequencyValue
    });
    
    if (yearsLeft <= 0) {
      console.log('Calculator: No years left, setting results to 0');
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
        totalPossibleTimes = Math.round((yearsLeft + yearsPassed) * daysInYear * frequencyValue);
        break;
      case 'times-per-week':
        timesLeft = Math.round(yearsLeft * 52 * frequencyValue);
        totalPossibleTimes = Math.round((yearsLeft + yearsPassed) * 52 * frequencyValue);
        break;
      case 'times-per-month':
        timesLeft = Math.round(yearsLeft * 12 * frequencyValue);
        totalPossibleTimes = Math.round((yearsLeft + yearsPassed) * 12 * frequencyValue);
        break;
      case 'times-per-year':
        timesLeft = Math.round(yearsLeft * frequencyValue);
        totalPossibleTimes = Math.round((yearsLeft + yearsPassed) * frequencyValue);
        break;
    }
    
    console.log('Calculator: Calculation results', { timesLeft, totalPossibleTimes });
    
    setResult(timesLeft);
    setTotalPossible(totalPossibleTimes);
    setPercentage(Math.round((timesLeft / totalPossibleTimes) * 100));
  };

  // DatePickerのカスタマイズ
  const getLocale = () => {
    const locale = i18n.language?.substring(0, 2) || 'ja';
    return locale === 'ja' ? ja : locale === 'zh' ? zhCN : enUS;
  };

  const handleDateChange = (date: Date | null) => {
    console.log('Calculator: Date changed to', date);
    setBirthdate(date);
  };

  // カスタムアクティビティの追加
  const handleAddCustomActivity = () => {
    if (!customActivity.trim()) return;
    
    const newId = `custom-${Date.now()}`;
    const newActivity = {
      id: newId,
      name: customActivity,
      startAge: currentActivity.startAge
    };
    
    console.log('Calculator: Adding custom activity', newActivity);
    setActivities([...activities, newActivity]);
    setCurrentActivity(newActivity);
    setCustomActivity('');
    setShowAddActivity(false);
  };

  // アクティビティの選択
  const handleSelectActivity = (activityId: string) => {
    const selectedActivity = activities.find(a => a.id === activityId);
    if (selectedActivity) {
      console.log('Calculator: Selected activity', selectedActivity);
      setCurrentActivity(selectedActivity);
    }
  };

  // アクティビティの削除
  const handleDeleteActivity = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (activities.length <= 1) return; // 少なくとも1つは残す
    
    console.log('Calculator: Deleting activity', activityId);
    const newActivities = activities.filter(a => a.id !== activityId);
    setActivities(newActivities);
    
    // 現在選択されているアクティビティが削除された場合、最初のアクティビティを選択
    if (currentActivity.id === activityId) {
      setCurrentActivity(newActivities[0]);
    }
  };

  // プリセットアクティビティの追加
  const handleAddPresetActivity = (presetId: string) => {
    const preset = presetActivities.find(p => p.id === presetId);
    if (!preset) return;
    
    // すでに存在しないか確認
    if (!activities.some(a => a.id === preset.id)) {
      console.log('Calculator: Adding preset activity', preset);
      setActivities([...activities, preset]);
    }
    
    setCurrentActivity(preset);
    setShowAddActivity(false);
  };

  // OGP画像が生成されたときのハンドラー
  const handleImageGenerated = (dataUrl: string) => {
    console.log('Calculator: OGP image generated');
    setOgImageUrl(dataUrl);
  };

  // 画像のダウンロード
  const handleDownloadImage = () => {
    if (!ogImageUrl) {
      console.log('Calculator: No OGP image URL available for download');
      alert(t('noImageAvailable'));
      return;
    }
    
    console.log('Calculator: Downloading OGP image, URL length:', ogImageUrl.length);
    
    try {
      // モバイルブラウザでの互換性向上のためのコード
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      console.log('Calculator: Device is mobile:', isMobile);
      
      if (isMobile) {
        // モバイルデバイス向けの処理
        // 新しいウィンドウで画像を開く
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>${t('title')}_${result}_${currentActivity.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 0; padding: 10px; text-align: center; background: #f0f0f0; font-family: sans-serif; }
                  img { max-width: 100%; height: auto; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); }
                  p { font-size: 14px; color: #666; margin-bottom: 20px; }
                  .button { display: inline-block; background: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold; }
                </style>
              </head>
              <body>
                <h2>${t('downloadImage')}</h2>
                <img src="${ogImageUrl}" alt="${t('title')}_${result}" />
                <p>${t('longPressToSave')}</p>
                <a href="${ogImageUrl}" download="${t('title')}_${result}_${currentActivity.name}.png" class="button">${t('saveImage')}</a>
              </body>
            </html>
          `);
          newTab.document.close();
        } else {
          // ポップアップがブロックされた場合
          alert(t('popupBlocked'));
        }
      } else {
        // デスクトップデバイス向けの処理
        const link = document.createElement('a');
        link.href = ogImageUrl;
        link.download = `${t('title')}_${result}_${currentActivity.name}.png`;
        document.body.appendChild(link);
        link.click();
        
        // 少し待ってからリンクを削除
        setTimeout(() => {
          document.body.removeChild(link);
          console.log('Calculator: Download initiated successfully');
        }, 100);
      }
    } catch (error) {
      console.error('Calculator: Error downloading image:', error);
      alert(t('downloadError'));
    }
  };

  // アクティビティを変更したときのサブタイトル更新
  // const getSubtitle = () => {
  //   if (!currentActivity) return t('subtitle');
  //   return t('subtitleWithActivity', { activity: currentActivity.name });
  // };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50">
      <p className="text-center text-sm text-gray-400 mb-6">
        {t('subtitle')}
      </p>
      
      <div className="space-y-7">
        {/* アクティビティ選択（ドロップダウン方式） */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('activity')}
          </label>
          
          <div className="relative">
            <select
              value={currentActivity.id}
              onChange={(e) => handleSelectActivity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white appearance-none pr-10"
            >
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setShowAddActivity(!showAddActivity)}
              className="flex items-center justify-center px-4 py-2 rounded-lg text-sm bg-gray-700/70 text-gray-200 hover:bg-gray-600 shadow-sm transition-all duration-200"
            >
              {showAddActivity ? t('hideAddActivity') : t('showAddActivity')}
            </button>
            
            {activities.length > 1 && (
              <button
                onClick={(e) => handleDeleteActivity(currentActivity.id, e as React.MouseEvent)}
                className="flex items-center justify-center px-4 py-2 rounded-lg text-sm bg-red-600/70 text-white hover:bg-red-500 shadow-sm transition-all duration-200"
              >
                {t('delete')}
              </button>
            )}
          </div>
          
          {showAddActivity && (
            <div className="p-4 bg-gray-700/50 rounded-lg space-y-3 shadow-inner border border-gray-600/30 mt-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('presetActivities')}
                </label>
                <div className="max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <div className="flex flex-col gap-2">
                    {presetActivities.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleAddPresetActivity(preset.id)}
                        className="px-3 py-2 bg-gray-600/70 text-gray-200 hover:bg-gray-500/80 rounded-lg text-sm transition-colors shadow-sm text-left"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('customActivity')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    placeholder={t('enterActivityName')}
                    className="flex-1 px-3 py-2 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
                  />
                  <button
                    onClick={handleAddCustomActivity}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    {t('add')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 入力フォームをカードで囲む */}
        <div className="p-5 bg-gray-700/40 rounded-lg shadow-inner border border-gray-600/30 space-y-5">
          {/* 年齢入力方法のトグルスイッチ */}
          <div className="mb-5">
            <span className="block text-sm font-medium text-gray-300 mb-3">
              {t('ageInputMethod')}
            </span>
            <div className="flex bg-gray-700 rounded-lg p-1 w-full max-w-xs">
              <button
                onClick={() => setAgeInputType('manual')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  ageInputType === 'manual'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-transparent text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {t('manualAge')}
              </button>
              <button
                onClick={() => setAgeInputType('birthdate')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  ageInputType === 'birthdate'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-transparent text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                {t('birthdate')}
              </button>
            </div>
          </div>
          
          {/* 開始年齢 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('startAge')}
            </label>
            <input
              type="number"
              min="0"
              max="150"
              value={currentActivity.startAge}
              onChange={(e) => setCurrentActivity({
                ...currentActivity,
                startAge: Number(e.target.value) || 0
              })}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
            />
          </div>
          
          {/* 現在年齢または生年月日 */}
          {ageInputType === 'manual' ? (
            <div className="mb-4">
              <label htmlFor="currentAge" className="block text-sm font-medium text-gray-300 mb-2">
            {t('currentAge')}
          </label>
          <input
            type="number"
            id="currentAge"
            min="0"
            max="150"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
          />
        </div>
              {currentAge !== '' && (
                <p className="mt-2 text-sm text-gray-400">
                  {t('calculatedAge')}: {currentAge}
                </p>
              )}
            </div>
          )}
          
          {/* 想定寿命 */}
          <div className="mb-4">
            <label htmlFor="expectedLifespan" className="block text-sm font-medium text-gray-300 mb-2">
            {t('expectedLifespan')}
          </label>
          <input
            type="number"
            id="expectedLifespan"
            min="0"
            max="150"
            value={expectedLifespan}
            onChange={(e) => setExpectedLifespan(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
          />
        </div>
        
          {/* 頻度設定 */}
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('frequency')}
          </label>
            <div className="flex items-center space-x-3">
            <select
              value={frequencyType}
              onChange={(e) => setFrequencyType(e.target.value as FrequencyType)}
                className="flex-grow px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
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
                className="w-24 px-4 py-3 border border-gray-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700/70 text-white"
                />
              <span className="text-gray-300 whitespace-nowrap">{t('times')}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-all duration-200 shadow-lg text-lg mt-2"
        >
          {t('calculate')}
        </button>
      </div>
      
      {result !== null && (
        <div className="mt-8 p-6 bg-indigo-900/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-indigo-700/50">
          <p className="text-center text-2xl font-medium text-indigo-100 mb-4 break-words">
            {t('resultWithActivity', { count: result, activity: currentActivity.name })}
          </p>
          
          {percentage !== null && (
            <div className="mt-5">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-indigo-200">{t('progressLabel')}</span>
                <span className="text-indigo-200 font-medium">{100 - percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-700" 
                  style={{ width: `${100 - percentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-400 text-center">
                {t('totalPossible', { total: totalPossible })}
              </p>
            </div>
          )}
          
          {/* SNSシェアボタン（コンパクト化） */}
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm text-center mb-3 text-gray-300">{t('shareResult')}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(t('shareTextTwitter', { count: result, activity: currentActivity.name }))}&url=${encodeURIComponent(window.location.href)}`;
                  console.log('Calculator: Opening Twitter share URL', tweetUrl);
                  window.open(tweetUrl, '_blank');
                }}
                className="bg-black hover:bg-gray-800 text-white p-2.5 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(t('shareTextLine', { count: result, activity: currentActivity.name }) + ' ' + window.location.href)}`;
                  console.log('Calculator: Opening LINE share URL', lineUrl);
                  window.open(lineUrl, '_blank');
                }}
                className="bg-[#06C755] hover:bg-[#05b34d] text-white p-2.5 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="LINE"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 0c4.411 0 8 2.912 8 6.492 0 1.433-.555 2.723-1.715 3.994-1.678 1.932-5.431 4.285-6.285 4.645-.83.35-.734-.197-.696-.413l.003-.018.114-.685c.027-.204.055-.521-.026-.723-.09-.223-.444-.339-.704-.395C2.846 12.39 0 9.701 0 6.492 0 2.912 3.59 0 8 0ZM5.022 7.686H3.497V4.918a.156.156 0 0 0-.155-.156H2.78a.156.156 0 0 0-.156.156v3.486c0 .041.017.08.044.107v.001l.002.002a.154.154 0 0 0 .11.047h2.242c.086 0 .155-.07.155-.156v-.56a.156.156 0 0 0-.155-.157Zm.791-2.924h.562c.086 0 .155.07.155.156v3.486c0 .086-.07.155-.155.155h-.562a.156.156 0 0 1-.156-.155V4.918c0-.086.07-.156.156-.156m1.5 0h.562c.086 0 .155.07.155.156v3.486c0 .086-.07.155-.155.155h-.562a.156.156 0 0 1-.156-.155V4.918c0-.086.07-.156.156-.156m1.5 0h1.687c.086 0 .155.07.155.156v.56c0 .086-.07.155-.155.155h-.97v2.77c0 .086-.07.156-.156.156h-.56a.156.156 0 0 1-.156-.155V4.918c0-.086.07-.156.156-.156Z"/>
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  console.log('Calculator: Instagram share button clicked');
                  alert(t('instagramShareGuide'));
                  handleDownloadImage();
                }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white p-2.5 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </button>
              
              <button 
                onClick={handleDownloadImage}
                className="bg-gray-700 hover:bg-gray-800 text-white p-2.5 rounded-full w-10 h-10 flex items-center justify-center"
                aria-label="Download Image"
                title={t('downloadImage')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* OGP画像生成（非表示） */}
          <div className="hidden overflow-hidden w-0 h-0">
            {result !== null && (
              <OgImage 
                count={result} 
                activity={currentActivity.name}
                language={i18n.language?.substring(0, 2) || 'ja'}
                onImageGenerated={handleImageGenerated}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 