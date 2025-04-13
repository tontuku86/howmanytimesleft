import { redirect } from 'next/navigation';
import { fallbackLng } from './i18n/settings';

export default function Home() {
  // デフォルト言語にリダイレクト
  redirect(`/${fallbackLng}`);
}
