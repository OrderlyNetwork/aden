import { MetaFunction } from "@remix-run/node";
import { PortfolioLayout, PortfolioLeftSidebarPath, SettingModule } from "@orderly.network/portfolio";
import { generatePageTitle } from "@/utils/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { LanguageSwitcherWidget } from "@orderly.network/ui-scaffold";
import { ChevronRightIcon, Flex, useScreen, Text } from "@orderly.network/ui";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { isDesktop } = useScreen();

  return (
    <>
      {isDesktop && (
        <Flex mt={1} mb={2} pl={4} intensity={900} r="xl" itemAlign="center">
          <LanguageSwitcherWidget open={open} onOpenChange={setOpen} />

          <Flex
            p={4}
            pl={0}
            className="oui-cursor-pointer"
            itemAlign="center"
            width="100%"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Text
              size="base"
              weight="semibold"
              intensity={80}
              className="oui-ml-2"
            >
              {t("languageSwitcher.language")}
            </Text>
            <ChevronRightIcon
              size={18}
              className="oui-ml-auto oui-text-base-contrast-36"
            />
          </Flex>
        </Flex>
      )}
      <SettingModule.SettingPage />
    </>
  )
}
