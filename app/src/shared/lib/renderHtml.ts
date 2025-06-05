"use server";

import { render } from '@react-email/render';

export async function renderHtml(component: React.ReactElement) {
  return render(component);
}