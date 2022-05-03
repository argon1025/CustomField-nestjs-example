-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `admin` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `store` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `store` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `store` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriesOnProducts` (
    `category` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`category`, `product`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `store` VARCHAR(191) NOT NULL,
    `customer` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdersOnProducts` (
    `product` VARCHAR(191) NOT NULL,
    `order` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`product`, `order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomField` (
    `id` VARCHAR(191) NOT NULL,
    `store` VARCHAR(191) NOT NULL,
    `origin` ENUM('Customer', 'Product', 'Order') NOT NULL,
    `require` BOOLEAN NOT NULL,
    `fieldType` ENUM('String', 'Number', 'Boolean') NOT NULL,
    `isArray` BOOLEAN NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomFieldDefaultData` (
    `id` VARCHAR(191) NOT NULL,
    `customField` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    UNIQUE INDEX `CustomFieldDefaultData_customField_key`(`customField`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomFieldEnumData` (
    `id` VARCHAR(191) NOT NULL,
    `customField` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    UNIQUE INDEX `CustomFieldEnumData_customField_key`(`customField`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerCustomField` (
    `id` VARCHAR(191) NOT NULL,
    `customer` VARCHAR(191) NOT NULL,
    `customField` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCustomField` (
    `id` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NOT NULL,
    `customField` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderCustomField` (
    `id` VARCHAR(191) NOT NULL,
    `order` VARCHAR(191) NOT NULL,
    `customField` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` DATE NOT NULL,
    `deletedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_admin_fkey` FOREIGN KEY (`admin`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_store_fkey` FOREIGN KEY (`store`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_store_fkey` FOREIGN KEY (`store`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_store_fkey` FOREIGN KEY (`store`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriesOnProducts` ADD CONSTRAINT `CategoriesOnProducts_category_fkey` FOREIGN KEY (`category`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoriesOnProducts` ADD CONSTRAINT `CategoriesOnProducts_product_fkey` FOREIGN KEY (`product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_store_fkey` FOREIGN KEY (`store`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customer_fkey` FOREIGN KEY (`customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdersOnProducts` ADD CONSTRAINT `OrdersOnProducts_product_fkey` FOREIGN KEY (`product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdersOnProducts` ADD CONSTRAINT `OrdersOnProducts_order_fkey` FOREIGN KEY (`order`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomField` ADD CONSTRAINT `CustomField_store_fkey` FOREIGN KEY (`store`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldDefaultData` ADD CONSTRAINT `CustomFieldDefaultData_customField_fkey` FOREIGN KEY (`customField`) REFERENCES `CustomField`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldEnumData` ADD CONSTRAINT `CustomFieldEnumData_customField_fkey` FOREIGN KEY (`customField`) REFERENCES `CustomField`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCustomField` ADD CONSTRAINT `CustomerCustomField_customer_fkey` FOREIGN KEY (`customer`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCustomField` ADD CONSTRAINT `CustomerCustomField_customField_fkey` FOREIGN KEY (`customField`) REFERENCES `CustomField`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCustomField` ADD CONSTRAINT `ProductCustomField_product_fkey` FOREIGN KEY (`product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCustomField` ADD CONSTRAINT `ProductCustomField_customField_fkey` FOREIGN KEY (`customField`) REFERENCES `CustomField`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCustomField` ADD CONSTRAINT `OrderCustomField_order_fkey` FOREIGN KEY (`order`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCustomField` ADD CONSTRAINT `OrderCustomField_customField_fkey` FOREIGN KEY (`customField`) REFERENCES `CustomField`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
