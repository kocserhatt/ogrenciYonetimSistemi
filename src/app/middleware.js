// middleware.js
import { NextResponse } from 'next/server';
import { supabase } from './lib/supabaseClient';

export async function middleware(req) {
  // Supabase Auth Cookie'den oturum bilgisini alalım
  const { data: { session } } = await supabase.auth.getSession();

  // Eğer oturum yoksa login sayfasına yönlendirme yap
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Eğer oturum varsa, işlemi devam ettir
  return NextResponse.next();
}

export const config = {
  matcher: ['/protected-route/:path*'],  // Korumalı sayfaları burada belirtebilirsin
};
