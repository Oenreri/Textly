module.exports = {
    presets: ['@react-native'],
    plugins: [
        'react-native-reanimated/plugin',
        ['module:react-native-dotenv', {
            moduleName: '@env',
            path: '.env',
            safe: true,
            allowUndefined: false,
        }],
    ],
};
