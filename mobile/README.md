# ECOMOPAR Mobile

Aplicativo Expo/React Native para associados ECOMOPAR.

## Executar no iPhone

1. Instale o **Expo Go** pela App Store.
2. Conecte computador e iPhone à mesma rede Wi-Fi.
3. Execute:

```powershell
cd mobile
npm install
npx expo start
```

4. Abra a câmera do iPhone, aponte para o QR Code e toque no aviso do Expo Go.

Se a rede local bloquear a conexão:

```powershell
npx expo start --tunnel
```

## Ambiente

O arquivo `.env` usa variáveis `EXPO_PUBLIC_FIREBASE_*`. Copie `.env.example`
e informe as mesmas credenciais Firebase utilizadas pelo site.
