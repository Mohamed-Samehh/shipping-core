// Test fixture builder. Wires every repository + service stack with a
// FixedClock + CounterIdGenerator so tests get fully deterministic ids
// and timestamps.

import { FixedClock } from '../src/lib/clock';
import { CounterIdGenerator } from '../src/lib/id';
import { AddressRepository } from '../src/repositories/address-repository';
import { CarrierRepository } from '../src/repositories/carrier-repository';
import { ServiceRepository } from '../src/repositories/service-repository';
import { AccountRepository } from '../src/repositories/account-repository';
import { ZoneRepository } from '../src/repositories/zone-repository';
import { PackageTypeRepository } from '../src/repositories/package-type-repository';
import { PackageRepository } from '../src/repositories/package-repository';
import { ShipmentRepository } from '../src/repositories/shipment-repository';
import { ShipmentItemRepository } from '../src/repositories/shipment-item-repository';
import { LabelRepository } from '../src/repositories/label-repository';
import { ManifestRepository } from '../src/repositories/manifest-repository';
import { ManifestEntryRepository } from '../src/repositories/manifest-entry-repository';
import { RateRepository } from '../src/repositories/rate-repository';
import { RateRequestRepository } from '../src/repositories/rate-request-repository';
import { TrackingEventRepository } from '../src/repositories/tracking-event-repository';
import { CustomsDeclarationRepository } from '../src/repositories/customs-declaration-repository';
import { CustomsItemRepository } from '../src/repositories/customs-item-repository';
import { SurchargeRepository } from '../src/repositories/surcharge-repository';
import { DiscountRepository } from '../src/repositories/discount-repository';
import { PickupRequestRepository } from '../src/repositories/pickup-request-repository';
import { ReturnRepository } from '../src/repositories/return-repository';
import { DeliveryExceptionRepository } from '../src/repositories/delivery-exception-repository';
import { ProofOfDeliveryRepository } from '../src/repositories/proof-of-delivery-repository';
import { InsuranceRepository } from '../src/repositories/insurance-repository';
import { ContractRepository } from '../src/repositories/contract-repository';
import { QuoteRepository } from '../src/repositories/quote-repository';
import { WebhookEndpointRepository } from '../src/repositories/webhook-endpoint-repository';
import { WebhookDeliveryRepository } from '../src/repositories/webhook-delivery-repository';
import { NotificationRepository } from '../src/repositories/notification-repository';
import { ForecastRepository } from '../src/repositories/forecast-repository';
import { ExportJobRepository } from '../src/repositories/export-job-repository';
import { LocationRepository } from '../src/repositories/location-repository';
import { CustomerRepository } from '../src/repositories/customer-repository';
import { RouteRepository } from '../src/repositories/route-repository';
import { RouteStopRepository } from '../src/repositories/route-stop-repository';
import { VehicleRepository } from '../src/repositories/vehicle-repository';
import { DriverRepository } from '../src/repositories/driver-repository';
import { TagRepository } from '../src/repositories/tag-repository';
import { HazmatDeclarationRepository } from '../src/repositories/hazmat-declaration-repository';
import { SignatureRecordRepository } from '../src/repositories/signature-record-repository';
import { DispatchSlotRepository } from '../src/repositories/dispatch-slot-repository';
import { ExceptionCodeRepository } from '../src/repositories/exception-code-repository';
import { AuditEventRepository } from '../src/repositories/audit-event-repository';
import { AuditService } from '../src/services/audit-service';
import { AddressService } from '../src/services/address-service';
import { CarrierService } from '../src/services/carrier-service';
import { ServiceService } from '../src/services/service-service';
import { AccountService } from '../src/services/account-service';
import { ZoneService } from '../src/services/zone-service';
import { PackageTypeService } from '../src/services/package-type-service';
import { PackageService } from '../src/services/package-service';
import { ShipmentService } from '../src/services/shipment-service';
import { ShipmentItemService } from '../src/services/shipment-item-service';
import { LabelService } from '../src/services/label-service';
import { ManifestService } from '../src/services/manifest-service';
import { ManifestEntryService } from '../src/services/manifest-entry-service';
import { RateService } from '../src/services/rate-service';
import { RateRequestService } from '../src/services/rate-request-service';
import { TrackingEventService } from '../src/services/tracking-event-service';
import { CustomsDeclarationService } from '../src/services/customs-declaration-service';
import { CustomsItemService } from '../src/services/customs-item-service';
import { SurchargeService } from '../src/services/surcharge-service';
import { DiscountService } from '../src/services/discount-service';
import { PickupRequestService } from '../src/services/pickup-request-service';
import { ReturnService } from '../src/services/return-service';
import { DeliveryExceptionService } from '../src/services/delivery-exception-service';
import { ProofOfDeliveryService } from '../src/services/proof-of-delivery-service';
import { InsuranceService } from '../src/services/insurance-service';
import { ContractService } from '../src/services/contract-service';
import { QuoteService } from '../src/services/quote-service';
import { WebhookEndpointService } from '../src/services/webhook-endpoint-service';
import { WebhookDeliveryService } from '../src/services/webhook-delivery-service';
import { NotificationService } from '../src/services/notification-service';
import { ForecastService } from '../src/services/forecast-service';
import { ExportJobService } from '../src/services/export-job-service';
import { LocationService } from '../src/services/location-service';
import { CustomerService } from '../src/services/customer-service';
import { RouteService } from '../src/services/route-service';
import { RouteStopService } from '../src/services/route-stop-service';
import { VehicleService } from '../src/services/vehicle-service';
import { DriverService } from '../src/services/driver-service';
import { TagService } from '../src/services/tag-service';
import { HazmatDeclarationService } from '../src/services/hazmat-declaration-service';
import { SignatureRecordService } from '../src/services/signature-record-service';
import { DispatchSlotService } from '../src/services/dispatch-slot-service';
import { ExceptionCodeService } from '../src/services/exception-code-service';

export interface Fixture {
  clock: FixedClock;
  ids: CounterIdGenerator;
  repositories: {
    auditEventRepository: AuditEventRepository;
    addressRepository: AddressRepository;
    carrierRepository: CarrierRepository;
    serviceRepository: ServiceRepository;
    accountRepository: AccountRepository;
    zoneRepository: ZoneRepository;
    packageTypeRepository: PackageTypeRepository;
    packageRepository: PackageRepository;
    shipmentRepository: ShipmentRepository;
    shipmentItemRepository: ShipmentItemRepository;
    labelRepository: LabelRepository;
    manifestRepository: ManifestRepository;
    manifestEntryRepository: ManifestEntryRepository;
    rateRepository: RateRepository;
    rateRequestRepository: RateRequestRepository;
    trackingEventRepository: TrackingEventRepository;
    customsDeclarationRepository: CustomsDeclarationRepository;
    customsItemRepository: CustomsItemRepository;
    surchargeRepository: SurchargeRepository;
    discountRepository: DiscountRepository;
    pickupRequestRepository: PickupRequestRepository;
    returnRepository: ReturnRepository;
    deliveryExceptionRepository: DeliveryExceptionRepository;
    proofOfDeliveryRepository: ProofOfDeliveryRepository;
    insuranceRepository: InsuranceRepository;
    contractRepository: ContractRepository;
    quoteRepository: QuoteRepository;
    webhookEndpointRepository: WebhookEndpointRepository;
    webhookDeliveryRepository: WebhookDeliveryRepository;
    notificationRepository: NotificationRepository;
    forecastRepository: ForecastRepository;
    exportJobRepository: ExportJobRepository;
    locationRepository: LocationRepository;
    customerRepository: CustomerRepository;
    routeRepository: RouteRepository;
    routeStopRepository: RouteStopRepository;
    vehicleRepository: VehicleRepository;
    driverRepository: DriverRepository;
    tagRepository: TagRepository;
    hazmatDeclarationRepository: HazmatDeclarationRepository;
    signatureRecordRepository: SignatureRecordRepository;
    dispatchSlotRepository: DispatchSlotRepository;
    exceptionCodeRepository: ExceptionCodeRepository;
  };
  services: {
    auditService: AuditService;
    addressService: AddressService;
    carrierService: CarrierService;
    serviceService: ServiceService;
    accountService: AccountService;
    zoneService: ZoneService;
    packageTypeService: PackageTypeService;
    packageService: PackageService;
    shipmentService: ShipmentService;
    shipmentItemService: ShipmentItemService;
    labelService: LabelService;
    manifestService: ManifestService;
    manifestEntryService: ManifestEntryService;
    rateService: RateService;
    rateRequestService: RateRequestService;
    trackingEventService: TrackingEventService;
    customsDeclarationService: CustomsDeclarationService;
    customsItemService: CustomsItemService;
    surchargeService: SurchargeService;
    discountService: DiscountService;
    pickupRequestService: PickupRequestService;
    returnService: ReturnService;
    deliveryExceptionService: DeliveryExceptionService;
    proofOfDeliveryService: ProofOfDeliveryService;
    insuranceService: InsuranceService;
    contractService: ContractService;
    quoteService: QuoteService;
    webhookEndpointService: WebhookEndpointService;
    webhookDeliveryService: WebhookDeliveryService;
    notificationService: NotificationService;
    forecastService: ForecastService;
    exportJobService: ExportJobService;
    locationService: LocationService;
    customerService: CustomerService;
    routeService: RouteService;
    routeStopService: RouteStopService;
    vehicleService: VehicleService;
    driverService: DriverService;
    tagService: TagService;
    hazmatDeclarationService: HazmatDeclarationService;
    signatureRecordService: SignatureRecordService;
    dispatchSlotService: DispatchSlotService;
    exceptionCodeService: ExceptionCodeService;
  };
  auditService: AuditService;
}

export function buildFixture(initialMs: string = '2025-01-01T00:00:00Z'): Fixture {
  const clock = new FixedClock(initialMs);
  const ids = new CounterIdGenerator('id');
  const auditEventRepository = new AuditEventRepository(clock);
  const auditService = new AuditService(auditEventRepository, clock, ids);
  const addressRepository = new AddressRepository(clock);
  const carrierRepository = new CarrierRepository(clock);
  const serviceRepository = new ServiceRepository(clock);
  const accountRepository = new AccountRepository(clock);
  const zoneRepository = new ZoneRepository(clock);
  const packageTypeRepository = new PackageTypeRepository(clock);
  const packageRepository = new PackageRepository(clock);
  const shipmentRepository = new ShipmentRepository(clock);
  const shipmentItemRepository = new ShipmentItemRepository(clock);
  const labelRepository = new LabelRepository(clock);
  const manifestRepository = new ManifestRepository(clock);
  const manifestEntryRepository = new ManifestEntryRepository(clock);
  const rateRepository = new RateRepository(clock);
  const rateRequestRepository = new RateRequestRepository(clock);
  const trackingEventRepository = new TrackingEventRepository(clock);
  const customsDeclarationRepository = new CustomsDeclarationRepository(clock);
  const customsItemRepository = new CustomsItemRepository(clock);
  const surchargeRepository = new SurchargeRepository(clock);
  const discountRepository = new DiscountRepository(clock);
  const pickupRequestRepository = new PickupRequestRepository(clock);
  const returnRepository = new ReturnRepository(clock);
  const deliveryExceptionRepository = new DeliveryExceptionRepository(clock);
  const proofOfDeliveryRepository = new ProofOfDeliveryRepository(clock);
  const insuranceRepository = new InsuranceRepository(clock);
  const contractRepository = new ContractRepository(clock);
  const quoteRepository = new QuoteRepository(clock);
  const webhookEndpointRepository = new WebhookEndpointRepository(clock);
  const webhookDeliveryRepository = new WebhookDeliveryRepository(clock);
  const notificationRepository = new NotificationRepository(clock);
  const forecastRepository = new ForecastRepository(clock);
  const exportJobRepository = new ExportJobRepository(clock);
  const locationRepository = new LocationRepository(clock);
  const customerRepository = new CustomerRepository(clock);
  const routeRepository = new RouteRepository(clock);
  const routeStopRepository = new RouteStopRepository(clock);
  const vehicleRepository = new VehicleRepository(clock);
  const driverRepository = new DriverRepository(clock);
  const tagRepository = new TagRepository(clock);
  const hazmatDeclarationRepository = new HazmatDeclarationRepository(clock);
  const signatureRecordRepository = new SignatureRecordRepository(clock);
  const dispatchSlotRepository = new DispatchSlotRepository(clock);
  const exceptionCodeRepository = new ExceptionCodeRepository(clock);
  const addressService = new AddressService(addressRepository, clock, ids, auditService);
  const carrierService = new CarrierService(carrierRepository, clock, ids, auditService);
  const serviceService = new ServiceService(serviceRepository, clock, ids, auditService);
  const accountService = new AccountService(accountRepository, clock, ids, auditService);
  const zoneService = new ZoneService(zoneRepository, clock, ids, auditService);
  const packageTypeService = new PackageTypeService(packageTypeRepository, clock, ids, auditService);
  const packageService = new PackageService(packageRepository, clock, ids, auditService);
  const shipmentService = new ShipmentService(shipmentRepository, clock, ids, auditService);
  const shipmentItemService = new ShipmentItemService(shipmentItemRepository, clock, ids, auditService);
  const labelService = new LabelService(labelRepository, clock, ids, auditService);
  const manifestService = new ManifestService(manifestRepository, clock, ids, auditService);
  const manifestEntryService = new ManifestEntryService(manifestEntryRepository, clock, ids, auditService);
  const rateService = new RateService(rateRepository, clock, ids, auditService);
  const rateRequestService = new RateRequestService(rateRequestRepository, clock, ids, auditService);
  const trackingEventService = new TrackingEventService(trackingEventRepository, clock, ids, auditService);
  const customsDeclarationService = new CustomsDeclarationService(customsDeclarationRepository, clock, ids, auditService);
  const customsItemService = new CustomsItemService(customsItemRepository, clock, ids, auditService);
  const surchargeService = new SurchargeService(surchargeRepository, clock, ids, auditService);
  const discountService = new DiscountService(discountRepository, clock, ids, auditService);
  const pickupRequestService = new PickupRequestService(pickupRequestRepository, clock, ids, auditService);
  const returnService = new ReturnService(returnRepository, clock, ids, auditService);
  const deliveryExceptionService = new DeliveryExceptionService(deliveryExceptionRepository, clock, ids, auditService);
  const proofOfDeliveryService = new ProofOfDeliveryService(proofOfDeliveryRepository, clock, ids, auditService);
  const insuranceService = new InsuranceService(insuranceRepository, clock, ids, auditService);
  const contractService = new ContractService(contractRepository, clock, ids, auditService);
  const quoteService = new QuoteService(quoteRepository, clock, ids, auditService);
  const webhookEndpointService = new WebhookEndpointService(webhookEndpointRepository, clock, ids, auditService);
  const webhookDeliveryService = new WebhookDeliveryService(webhookDeliveryRepository, clock, ids, auditService);
  const notificationService = new NotificationService(notificationRepository, clock, ids, auditService);
  const forecastService = new ForecastService(forecastRepository, clock, ids, auditService);
  const exportJobService = new ExportJobService(exportJobRepository, clock, ids, auditService);
  const locationService = new LocationService(locationRepository, clock, ids, auditService);
  const customerService = new CustomerService(customerRepository, clock, ids, auditService);
  const routeService = new RouteService(routeRepository, clock, ids, auditService);
  const routeStopService = new RouteStopService(routeStopRepository, clock, ids, auditService);
  const vehicleService = new VehicleService(vehicleRepository, clock, ids, auditService);
  const driverService = new DriverService(driverRepository, clock, ids, auditService);
  const tagService = new TagService(tagRepository, clock, ids, auditService);
  const hazmatDeclarationService = new HazmatDeclarationService(hazmatDeclarationRepository, clock, ids, auditService);
  const signatureRecordService = new SignatureRecordService(signatureRecordRepository, clock, ids, auditService);
  const dispatchSlotService = new DispatchSlotService(dispatchSlotRepository, clock, ids, auditService);
  const exceptionCodeService = new ExceptionCodeService(exceptionCodeRepository, clock, ids, auditService);
  return {
    clock, ids,
    repositories: {
      auditEventRepository,
      addressRepository,
      carrierRepository,
      serviceRepository,
      accountRepository,
      zoneRepository,
      packageTypeRepository,
      packageRepository,
      shipmentRepository,
      shipmentItemRepository,
      labelRepository,
      manifestRepository,
      manifestEntryRepository,
      rateRepository,
      rateRequestRepository,
      trackingEventRepository,
      customsDeclarationRepository,
      customsItemRepository,
      surchargeRepository,
      discountRepository,
      pickupRequestRepository,
      returnRepository,
      deliveryExceptionRepository,
      proofOfDeliveryRepository,
      insuranceRepository,
      contractRepository,
      quoteRepository,
      webhookEndpointRepository,
      webhookDeliveryRepository,
      notificationRepository,
      forecastRepository,
      exportJobRepository,
      locationRepository,
      customerRepository,
      routeRepository,
      routeStopRepository,
      vehicleRepository,
      driverRepository,
      tagRepository,
      hazmatDeclarationRepository,
      signatureRecordRepository,
      dispatchSlotRepository,
      exceptionCodeRepository,
    },
    services: {
      auditService,
      addressService,
      carrierService,
      serviceService,
      accountService,
      zoneService,
      packageTypeService,
      packageService,
      shipmentService,
      shipmentItemService,
      labelService,
      manifestService,
      manifestEntryService,
      rateService,
      rateRequestService,
      trackingEventService,
      customsDeclarationService,
      customsItemService,
      surchargeService,
      discountService,
      pickupRequestService,
      returnService,
      deliveryExceptionService,
      proofOfDeliveryService,
      insuranceService,
      contractService,
      quoteService,
      webhookEndpointService,
      webhookDeliveryService,
      notificationService,
      forecastService,
      exportJobService,
      locationService,
      customerService,
      routeService,
      routeStopService,
      vehicleService,
      driverService,
      tagService,
      hazmatDeclarationService,
      signatureRecordService,
      dispatchSlotService,
      exceptionCodeService,
    },
    auditService,
  };
}
