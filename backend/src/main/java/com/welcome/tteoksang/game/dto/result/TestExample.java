package com.welcome.tteoksang.game.dto.result;

public interface TestExample {
    String quarter = "{\n" +
            "    \"turn\": 361,\n" +
            "    \"rentFeeInfo\": {\n" +
            "        \"billType\": \"overdue\",\n" +
            "        \"rentFee\": 10000,\n" +
            "        \"productList\": [\n" +
            "            {\n" +
            "                \"productId\": 2,\n" +
            "                \"productQuantity\": 20\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 3,\n" +
            "                \"productQuantity\": 5\n" +
            "            }\n" +
            "        ]\n" +
            "    },\n" +
            "    \"quarterProfit\": 1000000,\n" +
            "    \"rentFee\": 10000,\n" +
            "    \"inProductList\": [3, 4, 5, 7, 8],\n" +
            "    \"titleId\": 1\n" +
            "}";

    String half = "{\n" +
            "    \"turn\": 361,\n" +
            "    \"rentFeeInfo\": {\n" +
            "        \"billType\": \"basic\",\n" +
            "        \"rentFee\": 40000,\n" +
            "        \"productList\": []\n" +
            "    },\n" +
            "    \"quarterReport\": {\n" +
            "        \"quarterProfit\": 1500000,\n" +
            "        \"rentFee\": 20000,\n" +
            "        \"inProductList\": [1, 7, 8],\n" +
            "        \"titleId\": 2,\n" +
            "        \"rentFeeInfo\": {\n" +
            "            \"billType\": \"basic\",\n" +
            "            \"rentFee\": 20000,\n" +
            "            \"productList\": []\n" +
            "        }\n" +
            "    },\n" +
            "    \"totalProductIncome\": 5000000,\n" +
            "    \"totalProductOutcome\": 2500000,\n" +
            "    \"totalBrokerFee\": 120000,\n" +
            "    \"totalUpgradeFee\": 50000,\n" +
            "    \"totalRentFee\": 30000,\n" +
            "    \"eventBonus\": 100000,\n" +
            "    \"participantCount\": 500,\n" +
            "    \"rankInfoList\": [\n" +
            "        {\n" +
            "            \"rankName\": \"판매왕\",\n" +
            "            \"rankDescription\": \"가장 많은 순수익을 얻은 사람(반기 기준)\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"일론 머스크\",\n" +
            "                \"profileIconId\": 3,\n" +
            "                \"profileFrameId\": 1\n" +
            "            },\n" +
            "            \"theFirstRecord\": 10000000,\n" +
            "            \"myRank\": 53,\n" +
            "            \"myRecord\": 2500000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"부자\",\n" +
            "            \"rankDescription\": \"현재 보유 금액\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"젠슨 황\",\n" +
            "                \"profileIconId\": 2,\n" +
            "                \"profileFrameId\": 2\n" +
            "            },\n" +
            "            \"theFirstRecord\": 210000000,\n" +
            "            \"myRank\": 112,\n" +
            "            \"myRecord\": 10000000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"큰 손\",\n" +
            "            \"rankDescription\": \"한 번에 돈을 제일 많이 쓴 사람(반기 기준)\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"김flex\",\n" +
            "                \"profileIconId\": 1,\n" +
            "                \"profileFrameId\": 1\n" +
            "            },\n" +
            "            \"theFirstRecord\": 1000000,\n" +
            "            \"myRank\": 12,\n" +
            "            \"myRecord\": 500000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"벼락부자\",\n" +
            "            \"rankDescription\": \"한 번에 제일 많은 돈을 번 사람(반기 기준)\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"단타 장인\",\n" +
            "                \"profileIconId\": 3,\n" +
            "                \"profileFrameId\": 3\n" +
            "            },\n" +
            "            \"theFirstRecord\": 5000000,\n" +
            "            \"myRank\": 138,\n" +
            "            \"myRecord\": 500000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"떡상\",\n" +
            "            \"rankDescription\": \"가장 높은 수익률(반기 기준)\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"제노\",\n" +
            "                \"profileIconId\": 1,\n" +
            "                \"profileFrameId\": 2\n" +
            "            },\n" +
            "            \"theFirstRecord\": 123.5,\n" +
            "            \"myRank\": 1,\n" +
            "            \"myRecord\": 123.5\n" +
            "        }\n" +
            "    ],\n" +
            "    \"tteoksangStatistics\": {\n" +
            "        \"values\": [\n" +
            "            {\n" +
            "                \"productId\": 3,\n" +
            "                \"value\": 12.5\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 7,\n" +
            "                \"value\": 11.2\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 5,\n" +
            "                \"value\": 9.3\n" +
            "            }\n" +
            "        ]\n" +
            "    },\n" +
            "    \"tteokrockStatistics\": {\n" +
            "        \"values\": [\n" +
            "            {\n" +
            "                \"productId\": 3,\n" +
            "                \"value\": -20.3\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 1,\n" +
            "                \"value\": -17.2\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 6,\n" +
            "                \"value\": -11.3\n" +
            "            }\n" +
            "        ]\n" +
            "    },\n" +
            "    \"bestSellerStatistics\": {\n" +
            "        \"values\": [\n" +
            "            {\n" +
            "                \"productId\": 3,\n" +
            "                \"value\": 15000000\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 7,\n" +
            "                \"value\": 12000000\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 1,\n" +
            "                \"value\": 9000000\n" +
            "            }\n" +
            "        ]\n" +
            "    },\n" +
            "    \"achievementList\": [{ \"achievementId\": 2 }, { \"achievementId\": 5 }]\n" +
            "}\n";

    String finalReport = "{\n" +
            "    \"rentFeeInfo\": {\n" +
            "        \"billType\": \"basic\",\n" +
            "        \"rentFee\": 20000,\n" +
            "        \"productList\": []\n" +
            "    },\n" +
            "    \"season\": 21,\n" +
            "    \"privateProductReportList\": [\n" +
            "        {\n" +
            "            \"year\": 1,\n" +
            "            \"productList\": [\n" +
            "                {\n" +
            "                    \"productId\": 1,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 3000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 2,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 4000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 3,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 1000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 2,\n" +
            "            \"productList\": [\n" +
            "                {\n" +
            "                    \"productId\": 1,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 2000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 2,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 3000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 3,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 7000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 3,\n" +
            "            \"productList\": [\n" +
            "                {\n" +
            "                    \"productId\": 1,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 5000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 1000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 2,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 3000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 3,\n" +
            "                    \"totalAccPrivateProductPurchaseQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductOutcome\": 2000000,\n" +
            "                    \"totalAccPrivateProductSalesQuantity\": 200,\n" +
            "                    \"totalAccPrivateProductIncome\": 3000000,\n" +
            "                    \"totalAccPrivateProductProfit\": 900000,\n" +
            "                    \"totalAccPrivateBrokerFee\": 100000\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ],\n" +
            "    \"publicProductReportList\": [\n" +
            "        {\n" +
            "            \"year\": 1,\n" +
            "            \"productList\": [\n" +
            "                {\n" +
            "                    \"productId\": 1,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 2,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 3,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 2,\n" +
            "            \"productList\": [\n" +
            "                {\n" +
            "                    \"productId\": 1,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 2,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 3,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 3,\n" +
            "            \"productList\": [\n" +
            "                {\n" +
            "                    \"productId\": 1,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 2,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                },\n" +
            "                {\n" +
            "                    \"productId\": 3,\n" +
            "                    \"totalAccProductPurchaseQuantity\": 10000000,\n" +
            "                    \"totalAccProductOutcome\": 2000000000,\n" +
            "                    \"totalAccProductSalesQuantity\": 9500000,\n" +
            "                    \"totalAccProductIncome\": 3500000000,\n" +
            "                    \"totalAccProductProfit\": 3300000000,\n" +
            "                    \"totalAccBrokerFee\": 200000000,\n" +
            "                    \"maxProductPurchaseQuantityPerTurn\": 300000,\n" +
            "                    \"maxProductSalesQuantityPerTurn\": 360000\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ],\n" +
            "    \"privateRentReportList\": [\n" +
            "        {\n" +
            "            \"year\": 1,\n" +
            "            \"totalAccPrivateRentFee\": 100000\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 2,\n" +
            "            \"totalAccPrivateRentFee\": 50000\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 3,\n" +
            "            \"totalAccPrivateRentFee\": 1500000\n" +
            "        }\n" +
            "    ],\n" +
            "    \"warehouseLevel\": 5,\n" +
            "    \"brokerLevel\": 9,\n" +
            "    \"vehicleLevel\": 7,\n" +
            "    \"privateUpgradeReportList\": [\n" +
            "        {\n" +
            "            \"year\": 1,\n" +
            "            \"totalAccPrivateUpgradeFee\": 120000\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 2,\n" +
            "            \"totalAccPrivateUpgradeFee\": 200000\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 3,\n" +
            "            \"totalAccPrivateUpgradeFee\": 80000\n" +
            "        }\n" +
            "    ],\n" +
            "    \"privateEventReportList\": [\n" +
            "        {\n" +
            "            \"year\": 1,\n" +
            "            \"privateEventList\": [\n" +
            "                {\n" +
            "                    \"eventId\": 6,\n" +
            "                    \"totalAccPrivateEventOccurCount\": 2\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 2,\n" +
            "            \"privateEventList\": []\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 3,\n" +
            "            \"privateEventList\": [\n" +
            "                {\n" +
            "                    \"eventId\": 6,\n" +
            "                    \"totalAccPrivateEventOccurCount\": 2\n" +
            "                },\n" +
            "                {\n" +
            "                    \"eventId\": 7,\n" +
            "                    \"totalAccPrivateEventOccurCount\": 1\n" +
            "                },\n" +
            "                {\n" +
            "                    \"eventId\": 8,\n" +
            "                    \"totalAccPrivateEventOccurCount\": 3\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ],\n" +
            "    \"specialEventReportList\": [\n" +
            "        {\n" +
            "            \"year\": 1,\n" +
            "            \"specialEventList\": [\n" +
            "                {\n" +
            "                    \"specialEventId\": 1,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                },\n" +
            "                {\n" +
            "                    \"specialEventId\": 3,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                },\n" +
            "                {\n" +
            "                    \"specialEventId\": 4,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 2,\n" +
            "            \"specialEventList\": [\n" +
            "                {\n" +
            "                    \"specialEventId\": 2,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                },\n" +
            "                {\n" +
            "                    \"specialEventId\": 4,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 2\n" +
            "                },\n" +
            "                {\n" +
            "                    \"specialEventId\": 5,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                }\n" +
            "            ]\n" +
            "        },\n" +
            "        {\n" +
            "            \"year\": 3,\n" +
            "            \"specialEventList\": [\n" +
            "                {\n" +
            "                    \"specialEventId\": 1,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 3\n" +
            "                },\n" +
            "                {\n" +
            "                    \"specialEventId\": 2,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                },\n" +
            "                {\n" +
            "                    \"specialEventId\": 5,\n" +
            "                    \"totalAccSpecialEventOccurCount\": 1\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    ],\n" +
            "    \"achievementList\": [1, 2, 3, 4, 5],\n" +
            "    \"privateAccPrivatePlayTime\": 1092,\n" +
            "    \"privateTimeSlotReportList\": [\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 0,\n" +
            "            \"privateTimeSlotCount\": 0\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 1,\n" +
            "            \"privateTimeSlotCount\": 0\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 2,\n" +
            "            \"privateTimeSlotCount\": 5\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 3,\n" +
            "            \"privateTimeSlotCount\": 2\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 4,\n" +
            "            \"privateTimeSlotCount\": 6\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 5,\n" +
            "            \"privateTimeSlotCount\": 7\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 6,\n" +
            "            \"privateTimeSlotCount\": 5\n" +
            "        },\n" +
            "        {\n" +
            "            \"timeSlotIndex\": 7,\n" +
            "            \"privateTimeSlotCount\": 3\n" +
            "        }\n" +
            "    ],\n" +
            "    \"tteoksangStatistics\": {\n" +
            "        \"values\": [\n" +
            "            {\n" +
            "                \"productId\": 1,\n" +
            "                \"value\": 20.6\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 3,\n" +
            "                \"value\": 17.9\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 4,\n" +
            "                \"value\": 13.8\n" +
            "            }\n" +
            "        ]\n" +
            "    },\n" +
            "    \"tteokrockStatistics\": {\n" +
            "        \"values\": [\n" +
            "            {\n" +
            "                \"productId\": 2,\n" +
            "                \"value\": -13.2\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 3,\n" +
            "                \"value\": -11.2\n" +
            "            },\n" +
            "            {\n" +
            "                \"productId\": 6,\n" +
            "                \"value\": -9.7\n" +
            "            }\n" +
            "        ]\n" +
            "    },\n" +
            "    \"rankInfoList\": [\n" +
            "        {\n" +
            "            \"rankName\": \"판매왕\",\n" +
            "            \"rankDescription\": \"가장 많은 순수익을 얻은 사람\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"일론 머스크\",\n" +
            "                \"profileIconId\": 3,\n" +
            "                \"profileFrameId\": 1\n" +
            "            },\n" +
            "            \"theFirstRecord\": 120000000,\n" +
            "            \"myRank\": 11,\n" +
            "            \"myRecord\": 11000000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"부자\",\n" +
            "            \"rankDescription\": \"현재 보유 금액\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"젠슨 황\",\n" +
            "                \"profileIconId\": 2,\n" +
            "                \"profileFrameId\": 2\n" +
            "            },\n" +
            "            \"theFirstRecord\": 2000000000,\n" +
            "            \"myRank\": 111,\n" +
            "            \"myRecord\": 100000000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"큰 손\",\n" +
            "            \"rankDescription\": \"한 번에 돈을 제일 많이 쓴 사람\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"김flex\",\n" +
            "                \"profileIconId\": 1,\n" +
            "                \"profileFrameId\": 1\n" +
            "            },\n" +
            "            \"theFirstRecord\": 2000000,\n" +
            "            \"myRank\": 3,\n" +
            "            \"myRecord\": 800000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"벼락부자\",\n" +
            "            \"rankDescription\": \"한 번에 제일 많은 돈을 번 사람\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"단타 장인\",\n" +
            "                \"profileIconId\": 3,\n" +
            "                \"profileFrameId\": 3\n" +
            "            },\n" +
            "            \"theFirstRecord\": 10000000,\n" +
            "            \"myRank\": 110,\n" +
            "            \"myRecord\": 5000000\n" +
            "        },\n" +
            "        {\n" +
            "            \"rankName\": \"떡상\",\n" +
            "            \"rankDescription\": \"가장 높은 수익률\",\n" +
            "            \"theFirstUserInfo\": {\n" +
            "                \"userNickname\": \"제노\",\n" +
            "                \"profileIconId\": 1,\n" +
            "                \"profileFrameId\": 2\n" +
            "            },\n" +
            "            \"theFirstRecord\": 1200.3,\n" +
            "            \"myRank\": 1,\n" +
            "            \"myRecord\": 1200.3\n" +
            "        }\n" +
            "    ]\n" +
            "}\n";
}
