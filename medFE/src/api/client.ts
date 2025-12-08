import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// ============================================
// 환경별 API Base URL 설정
// ============================================
// 로컬 개발: Vite 프록시 사용 (baseURL 빈 문자열)
// 배포 환경: 환경 변수로 설정된 백엔드 URL 사용 (ngrok 터널 URL 등)
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_BASE_URL || '')
  : '';

// 디버깅: baseURL 확인
if (typeof window !== 'undefined') {
  console.log('🔍 API 설정 확인:');
  console.log('  - 환경:', import.meta.env.MODE);
  console.log('  - 사용할 baseURL:', API_BASE_URL || '(빈 값 - Vite 프록시 사용)');
  
  if (!API_BASE_URL && import.meta.env.PROD) {
    console.warn('⚠️ 프로덕션 환경에서 VITE_API_BASE_URL이 설정되지 않았습니다!');
    console.warn('   Vercel 환경 변수에 백엔드 URL을 설정하세요 (예: ngrok 터널 URL)');
  }
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터: JWT 토큰 자동 추가 (로그인 필수 API만)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        const fullURL = config.baseURL 
          ? `${config.baseURL}${config.url}` 
          : config.url || '';
        
        // 로그인 없이 사용 가능한 API 경로 목록
        const publicApiPaths = [
          '/api/analysis/symptom',
          '/api/analysis/side-effect',
          '/api/analysis/ocr',
          '/api/medications/search',
          '/api/medications/search/batch',
        ];
        
        // 현재 요청이 공개 API인지 확인
        const isPublicApi = config.url && publicApiPaths.some(path => 
          config.url?.startsWith(path)
        );
        
        console.log('API 요청:', {
          url: config.url,
          method: config.method,
          baseURL: config.baseURL || '(상대 경로)',
          fullURL: fullURL,
          isPublicApi: isPublicApi,
          hasToken: !!token,
        });
        
        // 공개 API가 아니고 토큰이 있으면 추가
        if (!isPublicApi && token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        } else if (!isPublicApi && !token) {
          console.warn('No access token found in localStorage (인증 필요 API)');
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터: 토큰 만료 처리
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 401 (Unauthorized)만 자동 처리, 403은 각 컴포넌트에서 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // 토큰 만료 시 로그아웃 처리
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // 403 에러는 로깅만 하고 각 컴포넌트에서 처리하도록 함
        if (error.response?.status === 403) {
          console.error('403 Forbidden 상세:', {
            url: error.config?.url,
            method: error.config?.method,
            hasToken: !!localStorage.getItem('accessToken'),
            responseHeaders: error.response?.headers,
            responseData: error.response?.data,
            requestHeaders: error.config?.headers,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();

