"use client";

import React, { type SVGProps, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button, Spacer, useDisclosure, Tooltip, Card, addToast, Modal, ModalContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";
import SidebarDrawer from "./SidebarDrawer";
import { useTheme } from "next-themes";
import { useLoading } from '@/hooks/useLoading';
import { isLoginAtom, dietTokenAtom, userInfoAtom, langAtom } from "@/store";
import { useAtom } from "jotai";
import Login from "./Login";
import { langsMap, I18nKey, i18nAtom, useAtomValue } from "@/i18n";
// import { roleOptions } from "@/config";

const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const AcmeIcon: React.FC<IconSvgProps> = ({ size = 32, width, height, ...props }) => (
  <svg fill="none" height={size || height} viewBox="0 0 32 32" width={size || width} {...props}>
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);
/**
 *  This example requires installing the `usehooks-ts` package:
 * `npm install usehooks-ts`
 *
 * import {useMediaQuery} from "usehooks-ts";
 *
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <MessagingSidebar defaultSelectedKey={currentPath} selectedKeys={[currentPath]} />
 * ```
 */

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { LoadingComponent } = useLoading({ fullScreen: true });
  const { theme, setTheme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isLogin] = useAtom(isLoginAtom);
  const [, setDietToken] = useAtom(dietTokenAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const [lang, setLang] = useAtom(langAtom);
  const i18n = useAtomValue(i18nAtom);
  const [mounted, setMounted] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const onOpenDrawer = () => {
    onOpen();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const onLogout = () => {
    setDietToken('');
    addToast({
      title: '退出登录',
      description: '您已成功退出登录',
      color: 'success',
    });
  };

  const onLoginSuccess = (token: string) => {
    setDietToken(token);
    addToast({
      title: '登录成功',
      description: '您已成功登录',
      color: 'success',
    });
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, [theme, setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] gap-x-3 m-4 max-md:flex-col">
      <LoadingComponent />
      <SidebarDrawer
        className={cn("min-w-[288px] rounded-lg h-auto", { "min-w-[76px]": isCollapsed })}
        hideCloseButton={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <div
          className={cn(
            "will-change relative flex h-full w-72 flex-col bg-white dark:bg-[#18181b] p-6 transition-width",
            {
              "w-[83px] items-center px-[6px] py-6": isCollapsed,
            },
          )}
        >
          <div
            className={cn("flex items-center gap-3 pl-2", {
              "justify-center gap-0 pl-0": isCollapsed,
            })}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              <AcmeIcon className="text-background" />
            </div>
            <div className={cn("w-full flex items-end", {
              "w-0 opacity-0": isCollapsed,
            })}>
              <span
                className='text-lg font-bold uppercase opacity-100'
              >
                {i18n[I18nKey.appName]}
              </span>
              {/* <span className="ml-2 text-sm">{i18n[roleOptions.find((option) => option.value === userInfo?.role)?.label as keyof typeof I18nKey]}</span> */}
            </div>
            <div className={cn("flex-end flex", { hidden: isCollapsed })}>
              <Icon
                className="cursor-pointer dark:text-primary-foreground/60 [&>g]:stroke-[1px] max-md:hidden"
                icon="solar:round-alt-arrow-left-line-duotone"
                width={24}
                onClick={onToggle}
              />
            </div>
          </div>
          <Spacer y={6} />

          <Sidebar
            iconClassName="group-data-[selected=true]:text-default-50"
            isCompact={isCollapsed}
            itemClasses={{
              base: "px-3 rounded-large data-[selected=true]:!bg-foreground",
              title: "group-data-[selected=true]:text-default-50",
            }}
            items={userInfo?.menu.map((item) => ({
              ...item,
              title: i18n[item.title as keyof typeof I18nKey],
            })) ?? []}
            onSelect={(key) => {
              router.push(key as string);
            }}
          />

          <Spacer y={8} />

          <div
            className={cn("mt-auto flex flex-col", {
              "items-center": isCollapsed,
            })}
          >
            {isCollapsed && (
              <Button
                isIconOnly
                className="flex h-10 w-10 text-default-600"
                size="sm"
                variant="light"
                onPress={onToggle}
              >
                <Icon
                  className="cursor-pointer dark:text-primary-foreground/60 [&>g]:stroke-[1px]"
                  height={24}
                  icon="solar:round-alt-arrow-right-line-duotone"
                  width={24}
                />
              </Button>
            )}
            <Tooltip content={isLogin ? `${i18n[I18nKey.logout]}` : `${i18n[I18nKey.login]}`} isDisabled={!isCollapsed} placement="right">
              <Button
                fullWidth
                className={cn(
                  "justify-start truncate text-default-600 data-[hover=true]:text-foreground",
                  {
                    "justify-center": isCollapsed,
                  },
                )}
                isIconOnly={isCollapsed}
                variant="light"
                onPress={isLogin ? onLogout : onLoginOpen}
              >
                <Icon
                  className="flex-none text-default-600 dark:text-default-400"
                  icon={isLogin ? "solar:ghost-smile-broken" : "solar:user-circle-broken"}
                  width={24}
                />
                <span className={cn({ hidden: isCollapsed })}>{isLogin ? `${i18n[I18nKey.logout]}` : `${i18n[I18nKey.login]}`}</span>
              </Button>
            </Tooltip>
            {/* 中英文切换 */}
            <Dropdown trigger="press" placement="bottom" backdrop="blur">
              <DropdownTrigger>
                <Button
                  fullWidth
                  className={cn(
                    "justify-start truncate text-default-600 data-[hover=true]:text-foreground",
                    {
                      "justify-center": isCollapsed,
                    },
                  )}
                  isIconOnly={isCollapsed}
                  variant="light"
                >
                  <Icon icon="fa6-solid:language" width={24} />
                  <span className={cn({ hidden: isCollapsed })}>{langsMap[lang].label}</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {
                  Object.entries(langsMap).map(([key, value]) => (
                    <DropdownItem key={key} onPress={() => setLang(key)}>
                      <div className="flex items-center gap-2">
                        <Icon icon={value.icon} width={24} />
                        <span>{value.label}</span>
                      </div>
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
            <Tooltip content={theme === "dark" ? `${i18n[I18nKey.light]}` : `${i18n[I18nKey.dark]}`} isDisabled={!isCollapsed} placement="right">
              <Button
                fullWidth
                className={cn(
                  "justify-start truncate text-default-600 data-[hover=true]:text-foreground",
                  {
                    "justify-center": isCollapsed,
                  },
                )}
                isIconOnly={isCollapsed}
                variant="light"
                onPress={toggleTheme}
              >
                <Icon
                  className="text-default-500"
                  icon={theme === "dark" ? "solar:sun-line-duotone" : "solar:moon-line-duotone"}
                  width={24}
                />
                <span className={cn({ hidden: isCollapsed })}>{theme === "dark" ? `${i18n[I18nKey.light]}` : `${i18n[I18nKey.dark]}`}</span>
              </Button>
            </Tooltip>
            {/* github */}
            <Tooltip content="GitHub" isDisabled={!isCollapsed} placement="right">
              <Button
                fullWidth
                className={cn(
                  "justify-start truncate text-default-600 data-[hover=true]:text-foreground",
                  {
                    "justify-center": isCollapsed,
                  },
                )}
                isIconOnly={isCollapsed}
                variant="light"
                onPress={() => window.open('https://github.com/DevilC0822/healthy-diet', '_blank')}
              >
                <Icon
                  className="flex-none text-default-600 dark:text-default-400"
                  icon={theme === "dark" ? "skill-icons:github-light" : "skill-icons:github-dark"}
                  width={24}
                />
                <span className={cn({ hidden: isCollapsed })}>GitHub</span>
              </Button>
            </Tooltip>
          </div>
        </div>
      </SidebarDrawer>

      <div className="hidden max-md:flex justify-between items-center bg-gradient-to-br from-indigo-500 to-pink-500 p-4 rounded-lg mb-6">
        <Icon icon="solar:widget-6-linear" width={24} onClick={onOpenDrawer} />
        {/* <span className="text-2xl font-bold">配料表</span> */}
        <Icon icon="logos:github-icon" width={24} onClick={() => window.open('https://github.com/DevilC0822/healthy-diet', '_blank')} />
      </div>

      <main className="w-full h-auto overflow-y-auto">
        {isMobile ? (
          <div className='flex flex-col gap-4 h-full'>
            <Card className='flex-1' classNames={{
              base: 'overflow-scroll',
            }}>
              {children}
            </Card>
          </div>
        ) : (
          <div className='flex flex-col gap-4 h-full'>
            <Card className='flex-1' classNames={{
              base: 'overflow-scroll',
            }}>
              {children}
            </Card>
          </div>
        )}
      </main>

      <Modal
        isOpen={isLoginOpen}
        onOpenChange={onLoginOpen}
        backdrop="blur"
        hideCloseButton
        isDismissable={false}
        placement="center"
      >
        <ModalContent>
          <Login onLoginSuccess={onLoginSuccess} onClose={onLoginClose} />
        </ModalContent>
      </Modal>
    </div>
  );
}
