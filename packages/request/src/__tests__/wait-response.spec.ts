import { waitResponse } from '../utils/wait-response';

describe('@ygkit/object [waitResponse]', () => {
  const callback = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 4,
          otherStatus: 4,
          name: '@ygkit/request',
        });
      }, 500);
    });
  };
  const callback1 = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 2,
          otherStatus: 2,
          name: '@ygkit/request',
        });
      }, 500);
    });
  };
  describe('[targetProp = status]', () => {
    test(' should get target response', async () => {
      const res = await waitResponse({
        callback,
        targetProp: 'status',
        targetResponse: 4,
        timeout: 5000,
      });
      expect(res).toEqual({
        status: 4,
        otherStatus: 4,
        name: '@ygkit/request',
      });
    });
  });

  describe('[targetProp = otherStatus]', () => {
    test('should get target response', async () => {
      const res = await waitResponse({
        callback,
        targetProp: 'otherStatus',
        targetResponse: 4,
        timeout: 5000,
      });
      expect(res).toEqual({
        status: 4,
        otherStatus: 4,
        name: '@ygkit/request',
      });
    });
  });
  describe('[start]', () => {
    test('should get target response', async () => {
      const res = await waitResponse({
        callback,
        targetProp: 'otherStatus',
        targetResponse: 4,
        timeout: 5000,
        start: Date.now() + 500,
      });
      expect(res).toEqual({
        status: 4,
        otherStatus: 4,
        name: '@ygkit/request',
      });
    });
  });
  describe('[loopGap]', () => {
    test('should get target response', async () => {
      const res = await waitResponse({
        callback,
        targetProp: 'otherStatus',
        targetResponse: 4,
        timeout: 5000,
        loopGap: 500,
      });
      expect(res).toEqual({
        status: 4,
        otherStatus: 4,
        name: '@ygkit/request',
      });
    });
  });
  describe('[start past 2 seconds]', () => {
    test('should reject timeout', async () => {
      try {
        await waitResponse({
          callback: callback1,
          targetProp: 'otherStatus',
          targetResponse: 4,
          timeout: 5000,
          start: Date.now() - 2000,
        });
      } catch (e) {
        expect(e.message).toEqual(
          '[TIMEOUT] Cannot complete in 5000ms, otherStatus: 2',
        );
      }
    });
  });
  describe('[default]', () => {
    test('should reject timeout', async () => {
      try {
        await waitResponse({
          callback: callback1,
          targetProp: 'status',
          targetResponse: 4,
          timeout: 1000,
        });
      } catch (e) {
        expect(e.message).toEqual(
          '[TIMEOUT] Cannot complete in 1000ms, status: 2',
        );
      }
    });
  });
  describe('[targetProp = status]', () => {
    test('should reject timeout', async () => {
      try {
        await waitResponse({
          callback: callback1,
          targetProp: 'status',
          targetResponse: 4,
          timeout: 1000,
        });
      } catch (e) {
        expect(e.message).toEqual(
          '[TIMEOUT] Cannot complete in 1000ms, status: 2',
        );
      }
    });
  });
  describe('[callbackError]', () => {
    const callbackError = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Request Error'));
        }, 500);
      });
    };
    test('should get request error', async () => {
      try {
        await waitResponse({
          callback: callbackError,
          targetProp: 'status',
          targetResponse: 4,
          timeout: 5000,
        });
      } catch (e) {
        expect(e.message).toEqual('Request Error');
      }
    });
  });

  describe('Test null target response', () => {
    const callback = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 500);
      });
    };

    test('should get null target response', async () => {
      const res = await waitResponse({
        callback,
        targetResponse: null,
        timeout: 5000,
      });
      expect(res).toEqual(null);
    });
  });
});
