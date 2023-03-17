import { Button, ConfigProvider, Space, Typography, theme } from 'antd';
import { createRoot } from 'react-dom/client';
import { useProxy, run, releaseChildren } from '@tylerlong/use-proxy';
import React, { useEffect, useState } from 'react';
import { ProxyEvent } from '@tylerlong/use-proxy/lib/models';

class Store {
  public count = 0;
  public increase() {
    this.count += 1;
  }
  public decrease() {
    this.count -= 1;
  }
}

const store = useProxy(new Store());

const App = (props: { store: Store }) => {
  const [dark, setDark] = useState(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  const [_, refresh] = useState(false);
  const render = () => (
    <ConfigProvider theme={{ algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Typography.Title>Hello world!</Typography.Title>
      <Space>
        <Button onClick={() => store.decrease()}>-</Button>
        <Typography.Text>{store.count}</Typography.Text>
        <Button onClick={() => store.increase()}>+</Button>
      </Space>
    </ConfigProvider>
  );
  const propsProxy = useProxy(props);
  const [result, isTrigger] = run(propsProxy, render);
  useEffect(() => {
    document.body.style.backgroundColor = (dark ? theme.darkAlgorithm : theme.defaultAlgorithm)(
      theme.defaultSeed,
    ).colorBgContainer;
    const useProxyListner = (event: ProxyEvent) => {
      if (isTrigger(event)) {
        refresh(!_);
      }
    };
    propsProxy.__emitter__.on('event', useProxyListner);
    const mediaQueryListener = () => {
      setDark(window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    };
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', mediaQueryListener);
    return () => {
      releaseChildren(propsProxy);
      propsProxy.__emitter__.off('event', useProxyListner);
      darkModeMediaQuery.removeEventListener('change', mediaQueryListener);
    };
  });
  return result;
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App store={store} />);
