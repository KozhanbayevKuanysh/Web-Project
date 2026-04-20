import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Извлекаем токен из localStorage
  const token = localStorage.getItem('access_token');

  // Если токен есть, клонируем запрос и добавляем заголовок Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Если токена нет (например, при логине), отправляем запрос как есть
  return next(req);
};